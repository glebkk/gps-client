import React, {useEffect, useRef, useState} from "react";
import {YMaps, Placemark, Polyline} from "@pbe/react-yandex-maps";
import MyMap from "./MyMap";
import {convertTimeFromIso, convertTimeFromUnix, convertTimeToLocaleTime} from "./utils/convertTime";

const baseUrl = "http://37.27.2.5:8080"
function App() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(0);
    const [movements, setMovements] = useState([])
    const [timeStart, setTimeStart] = useState("")
    const [timeEnd, setTimeEnd] = useState("")
    const mapRef = useRef(null)
    const [center, setCenter] = useState([55.182840, 30.203094])

    const [userMove, setUserMove] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`${baseUrl}/users`);
            const json = await data.json();
            setSelectedUser(json[0].id)
            setUsers(json);
        }

        fetchData().catch(console.error);
    }, [])


    // useEffect(() => {
    //     // Создайте новый экземпляр WebSocket
    //     const socket = new WebSocket('ws://37.27.2.5:8080/ws?id=3');
    //
    //
    //     // Подключитесь к серверу WebSocket при монтировании компонента
    //     socket.onopen = () => {
    //         console.log('WebSocket connected');
    //         // Здесь вы можете отправить сообщение на сервер или выполнить другие действия
    //     };
    //
    //     // Обработайте получение данных от сервера WebSocket
    //     socket.onmessage = async (event) => {
    //         const data = JSON.parse(event.data);
    //         console.log(data)
    //         setCenter([data.latitude, data.longitude])
    //         setUserMove(prev => {
    //             console.log([...prev, [data.latitude, data.longitude]])
    //             return [...prev, [data.latitude, data.longitude]]
    //         })
    //         await mapRef.current.setCenter([data.latitude, data.longitude], 20, {duration: 500, timingFunction: "ease-in-out"})
    //     };
    //
    //     // Обработайте закрытие соединения WebSocket
    //     socket.onclose = () => {
    //         console.log('WebSocket connection closed');
    //         // Здесь вы можете выполнить дополнительные действия при закрытии соединения
    //     };
    //
    //     // Закройте соединение WebSocket при размонтировании компонента
    //     return () => {
    //         socket.close();
    //     };
    // }, []);


    const fetchRoute = async () => {
        const data = await fetch( `${baseUrl}/movements/` + selectedUser + `?timeStart=${timeStart}&timeEnd=${timeEnd}`)
        const json = await data.json()
        if(json)
            // await mapRef.current.panTo([json[0].latitude, json[0].longitude], {safe: true, flying: false})
            await mapRef.current.setCenter([json[0].longitude, json[0].latitude], 15, {duration: 500, timingFunction: "ease-in-out"})
        setMovements(json)
    }

    return (
    <div className="App">
        <select
            value={selectedUser}
            onChange={e => {setSelectedUser(+e.target.value)}}
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

                {/*<Placemark*/}
                {/*    geometry={center}*/}
                {/*    // properties={{*/}
                {/*    //     hintContent: `${movement.latitude}, ${movement.longitude}; ${convertTimeToLocaleTime(movement.createdAt)}`,*/}
                {/*    //     balloonContent: `<h3>${movement.latitude}, ${movement.longitude}; ${convertTimeToLocaleTime(movement.createdAt)}</h3>`*/}
                {/*    // }}*/}

                {/*    options={{*/}
                {/*        preset: "islands#blackCircleDotIcon",*/}
                {/*    }}*/}

                {/*    modules={*/}
                {/*        ['geoObject.addon.balloon', 'geoObject.addon.hint']*/}
                {/*    }*/}
                {/*/>*/}

                {/*<Polyline*/}
                {/*    geometry={userMove}*/}
                {/*    options={{*/}
                {/*        strokeColor: "#00ff0a",*/}
                {/*        strokeWidth: 4,*/}
                {/*    }}*/}
                {/*/>*/}


                {movements && movements.map(movement => {
                    return <React.Fragment key={movement.id}>
                        <Placemark
                            geometry={[movement.longitude, movement.latitude]}
                            properties={{
                                hintContent: `${movement.latitude}, ${movement.longitude}; ${convertTimeToLocaleTime(movement.createdAt)}`,
                                balloonContent: `<h3>${movement.latitude}, ${movement.longitude}; ${convertTimeToLocaleTime(movement.createdAt)}</h3>`
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
