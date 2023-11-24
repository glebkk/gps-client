import React from 'react';
import {Map} from "@pbe/react-yandex-maps";

function MyMap({children}) {
    return (
        <Map
            defaultState={{
                center: [55.182840, 30.203094],
                zoom: 15
            }}
            width={"95vw"}
            height={"80vh"}
            options={{
                maxZoom: 20,
            }}
        >
            {children}
        </Map>
    );
}

export default MyMap;