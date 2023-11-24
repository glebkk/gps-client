import React, {useEffect, useState} from "react";
import {YMaps, Placemark} from "@pbe/react-yandex-maps";
import MyMap from "./MyMap";
function App() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(0);
    const [movements, setMovements] = useState([])
    const [timeStart, setTimeStart] = useState("")
    const [timeEnd, setTimeEnd] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('http://localhost:8080/users');
            const json = await data.json();
            setSelectedUser(json[0].id)
            setUsers(json);
        }

        fetchData().catch(console.error);
    }, [])

    const fetchRoute = async () => {
        const data = await fetch( "http://localhost:8080/movements/" + selectedUser + `?timeStart=${timeStart}&timeEnd=${timeEnd}`)
        console.log(data)
        const json = await data.json()
        console.log(json)
        setMovements(json)
    }

    return (
    <div className="App">
        <select
            value={selectedUser}
            onChange={e => {console.log(e.target.value); setSelectedUser(+e.target.value)}}
        >
            {users.map((u) => {
                return <option value={u.id} key={u.uuid}>{u.name}</option>
            })}
        </select>
        <label htmlFor="timeStart">Time start</label>
        <input onChange={e => {console.log(e.target.value); setTimeStart(e.target.value)}} id="timeStart" type="datetime-local" />
        <label htmlFor="timeEnd">Time end</label>
        <input onChange={e => {console.log(e.target.value); setTimeEnd(e.target.value)}} id="timeEnd" type="datetime-local" />
        <button onClick={() => fetchRoute()}>get routes</button>
        <YMaps>
            <MyMap>
                {movements.map(movement => {
                    console.log([movement.latitude, movement.longitude])
                    return <React.Fragment key={movement.id}>
                        <Placemark
                            geometry={[movement.latitude, movement.longitude]}
                        />
                    </React.Fragment>
                })}
            </MyMap>
        </YMaps>
    </div>
  );
}

export default App;
