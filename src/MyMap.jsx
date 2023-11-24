import React from 'react';
import {FullscreenControl, Map} from "@pbe/react-yandex-maps";

function MyMap({children, instRef}) {
    console.log(instRef)
    return (
        <Map
            instanceRef={instRef}
            width={"95vw"}
            height={"80vh"}
            defaultState={{
                center: [55.182840, 30.203094],
                zoom: 15
            }}
        >
            {children}
            <FullscreenControl />
        </Map>
    );
}

export default MyMap;