import React, {useEffect, useRef, useState} from "react";
import {YMaps, Placemark} from "@pbe/react-yandex-maps";
import MyMap from "./MyMap";
import {convertTimeFromIso} from "./utils/convertTime";
function App() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(0);
    const [movements, setMovements] = useState([])
    const [timeStart, setTimeStart] = useState("")
    const [timeEnd, setTimeEnd] = useState("")
    const mapRef = useRef(null)

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
        const json = await data.json()
        if(json)
            // await mapRef.current.panTo([json[0].latitude, json[0].longitude], {safe: true, flying: false})
            await mapRef.current.setCenter([json[0].latitude, json[0].longitude], 15, {duration: 500, timingFunction: "ease-in-out"})
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
        <input onChange={e => setTimeStart(e.target.value)} id="timeStart" type="datetime-local" />
        <label htmlFor="timeEnd">Time end</label>
        <input onChange={e => setTimeEnd(e.target.value)} id="timeEnd" type="datetime-local" />
        <button onClick={() => fetchRoute()}>get routes</button>
        <YMaps>
            <MyMap instRef={mapRef}>
                {movements && movements.map(movement => {
                    return <React.Fragment key={movement.id}>
                        <Placemark
                            geometry={[movement.latitude, movement.longitude]}
                            properties={{
                                hintContent: `${movement.latitude}, ${movement.longitude}; ${convertTimeFromIso(movement.createdAt).toLocaleString()}`,
                                balloonContent: `<h3>${movement.latitude}, ${movement.longitude}; ${convertTimeFromIso(movement.createdAt).toLocaleString()}</h3>`
                            }}

                            options={{
                                preset: "islands#blackCircleDotIcon",
                            }}

                            modules={
                                ['geoObject.addon.balloon', 'geoObject.addon.hint']
                            }
                        />
                    </React.Fragment>
                })}
            </MyMap>
        </YMaps>
    </div>
  );
}

export default App;
