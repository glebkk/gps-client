import React, {useState} from 'react';
import {FullscreenControl, Map, Polygon, RulerControl} from "@pbe/react-yandex-maps";
import {baseUrl} from "./App";

function MyMap({children, instRef}) {
    const [polygonCoordinates, setPolygonCoordinates] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const handleMapClick = (e) => {
        if (isDrawing) {
            const newCoordinates = e.get('coords');
            setPolygonCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinates]);
        }
    };

    const handleDrawButtonClick = () => {
        setIsDrawing(true);
    };

    const handleSaveButtonClick = async () => {
        setIsDrawing(false);
        // Here you can save the polygon coordinates or perform any other desired action
        polygonCoordinates.push(polygonCoordinates[0])
        const geojson = { geometry:{ type: 'Polygon', coordinates: [polygonCoordinates] }}
        console.log(geojson)
        await fetch(`${baseUrl}/polygons`, {method: "post", body: JSON.stringify(geojson)})
        setPolygonCoordinates([])
    };


    return (<>
            <Map
                instanceRef={instRef}
                width={"95vw"}
                height={"80vh"}
                onClick={handleMapClick}
                defaultState={{
                    center: [55.182840, 30.203094], zoom: 15
                }}
            >
                {polygonCoordinates.length > 0 && (
                    <Polygon
                        geometry={[polygonCoordinates]}
                        options={{
                            fillColor: '#00FF0088',
                            strokeColor: '#0000FF',
                            strokeWidth: 2,
                        }}
                    />
                )}
                {children}
                <FullscreenControl/>
                <RulerControl/>
            </Map>
            <button onClick={handleDrawButtonClick}>Start Drawing</button>
            <button onClick={handleSaveButtonClick}>Save Polygon</button>
        </>);
}

export default MyMap;