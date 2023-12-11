import React, {useEffect, useRef, useState} from "react";
import {YMaps, Placemark, Polyline, Polygon} from "@pbe/react-yandex-maps";
import MyMap from "./MyMap";
import {convertTimeToLocaleTime} from "./utils/convertTime";
import {getRandomColor} from "./utils/colors";
import moment from 'moment'

export const baseUrl = "http://172.18.208.1:8080"
function App() {
    const [users, setUsers] = useState([])
    const [polygons, setPolygons] = useState([])
    const [selectedUserId, setSelectedUserId] = useState(0);
    const [movements, setMovements] = useState([])
    const [timeStart, setTimeStart] = useState("")
    const [timeEnd, setTimeEnd] = useState("")
    const mapRef = useRef(null)
    const [center, setCenter] = useState([])
    const [userMove, setUserMove] = useState([])
    const [isTracking, setIsTracking] = useState(false)
    const [userVisits, setUserVisits] = useState([])
    const socket = useRef(null)


    const fetchData = async () => {
        const data = await fetch(`${baseUrl}/users`);
        const json = await data.json();
        setSelectedUserId(json[0].id)
        setUsers(json);
    }

    const fetchPolygons = async () => {
        const data = await fetch(`${baseUrl}/polygons`)
        const json = await data.json()
        console.log(json)
        setPolygons(json)
    }

    useEffect(() => {
        fetchData().catch(console.error);
        fetchPolygons().catch()
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
                // await mapRef.current.setCenter([data.latitude, data.longitude], mapRef.current.zoomRange.getCurrent()[1], {
                //     duration: 2000,
                //     timingFunction: "ease-in-out"
                // })
            };

            socket.current.onclose = () => {
                console.log('WebSocket connection closed');
                alert(`Пользователь ${users[selectedUserId - 1].name} выключил трекер`)
                setIsTracking(false)
                setCenter([])
                fetchData().then()
            };
            return
        }
        socket.current.close()
    }

    const fetchVisits = async () => {
        const data = await fetch(`${baseUrl}/visits?id=${selectedUserId}`)
        const json = await data.json()
        setUserVisits(json)
        console.log(json)
    }


    const fetchRoute = async () => {
        const data = await fetch( `${baseUrl}/movements/` + selectedUserId + `?timeStart=${timeStart}&timeEnd=${timeEnd}`)
        const json = await data.json()
        // if(json)
            // await mapRef.current.panTo([json[0].latitude, json[0].longitude], {safe: true, flying: false})
            // await mapRef.current.setCenter([json[0].latitude, json[0].longitude], 15, {duration: 1000, timingFunction: "ease-in-out"})
        setMovements(json)
        await fetchVisits()
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

                {polygons && polygons.map(polygon => {
                    let hint
                    if(userVisits){
                        for(const visit of userVisits){
                            if(visit.polygonId === polygon.id){
                                hint = `${visit.timeEntry} ${visit.timeExit} ${moment(Date.parse(visit.timeExit) - Date.parse(visit.timeEntry)).format('hh:mm:ss')}`
                            }
                        }
                    }
                    return <Polygon
                        key={polygon.id}
                        geometry={polygon.geometry.coordinates}
                        properties={{
                            balloonContent: hint,
                            hintContent: hint
                        }}

                        options={{
                            strokeColor: "#67a9ff",
                            strokeWidth: 3,
                            fillOpacity: 0.5,
                            fillColor: "#ff84f9"
                        }}
                    />
                })}


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


                        />
                    </React.Fragment>
                })}
            </MyMap>
        </YMaps>
    </div>
  );
}

export default App;
