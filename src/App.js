import React, {useEffect, useRef, useState} from "react";
import {YMaps, Placemark, Polyline} from "@pbe/react-yandex-maps";
import MyMap from "./MyMap";
import {convertTimeToLocaleTime} from "./utils/convertTime";
import {getRandomColor} from "./utils/colors";

const baseUrl = "http://172.18.208.1:8080"
function App() {
    const [users, setUsers] = useState([])
    const [selectedUserId, setSelectedUserId] = useState(0);
    const [movements, setMovements] = useState([])
    const [timeStart, setTimeStart] = useState("")
    const [timeEnd, setTimeEnd] = useState("")
    const mapRef = useRef(null)
    const [center, setCenter] = useState([])
    const [userMove, setUserMove] = useState([])
    const [isTracking, setIsTracking] = useState(false)
    const socket = useRef(null)

    const fetchData = async () => {
        const data = await fetch(`${baseUrl}/users`);
        const json = await data.json();
        setSelectedUserId(json[0].id)
        setUsers(json);
    }

    useEffect(() => {
        fetchData().catch(console.error);
    }, [])


    const handleTrack = () => {
        setIsTracking(!isTracking)
        if (!isTracking) {
            // Создайте новый экземпляр WebSocket
            socket.current = new WebSocket('ws://172.18.208.1:8080/ws?id=' + selectedUserId);
            // Подключитесь к серверу WebSocket при монтировании компонента
            socket.current.onopen = () => {
                console.log('WebSocket connected');
                // Здесь вы можете отправить сообщение на сервер или выполнить другие действия
            };

            // Обработайте получение данных от сервера WebSocket
            socket.current.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                setCenter([data.latitude, data.longitude])
                setUserMove(prev => {
                    return [...prev, [data.latitude, data.longitude]]
                })
                await mapRef.current.setCenter([data.latitude, data.longitude], mapRef.current.zoomRange.getCurrent()[1], {
                    duration: 2000,
                    timingFunction: "ease-in-out"
                })
            };

            socket.current.onclose = () => {
                console.log('WebSocket connection closed');
                alert(`Пользователь ${users[selectedUserId - 1].name} выключил трекер`)
                setIsTracking(false)
                setUserMove([])
                setCenter([])
                fetchData().then()
            };
            return
        }
        socket.current.close()
    }


    const fetchRoute = async () => {
        const data = await fetch( `${baseUrl}/movements/` + selectedUserId + `?timeStart=${timeStart}&timeEnd=${timeEnd}`)
        const json = await data.json()
        if(json)
            // await mapRef.current.panTo([json[0].latitude, json[0].longitude], {safe: true, flying: false})
            await mapRef.current.setCenter([json[0].latitude, json[0].longitude], 15, {duration: 1000, timingFunction: "ease-in-out"})
        setMovements(json)
    }

    return (
    <div className="App">
        <select
            value={selectedUserId}
            onChange={e => {setSelectedUserId(+e.target.value)}}
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
        {users[selectedUserId - 1] && users[selectedUserId - 1].isTracking &&
            <button onClick={handleTrack}>
                {!isTracking ? "track" : "stop track"}
            </button>
        }
        <button onClick={fetchData}>reload</button>
        <YMaps>
            <MyMap instRef={mapRef}>

                {isTracking &&
                    <>
                        <Placemark
                            geometry={center}
                            // properties={{
                            //     hintContent: `${movement.latitude}, ${movement.longitude}; ${convertTimeToLocaleTime(movement.createdAt)}`,
                            //     balloonContent: `<h3>${movement.latitude}, ${movement.longitude}; ${convertTimeToLocaleTime(movement.createdAt)}</h3>`
                            // }}

                            options={{
                                preset: "islands#blackCircleDotIcon",
                            }}

                            modules={
                                ['geoObject.addon.balloon', 'geoObject.addon.hint']
                            }
                        />

                        <Polyline
                            geometry={userMove}
                            options={{
                                strokeColor: getRandomColor(),
                                strokeWidth: 4,
                            }}
                        />
                    </>
                }


                {movements && movements.map(movement => {
                    return <React.Fragment key={movement.id}>
                        <Placemark
                            geometry={[movement.latitude, movement.longitude]}
                            properties={{
                                hintContent: `${convertTimeToLocaleTime(movement.createdAt)}`,
                                balloonContent: `<h3>${users[selectedUserId - 1].name} </br> ${convertTimeToLocaleTime(movement.createdAt)}</h3>`
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
