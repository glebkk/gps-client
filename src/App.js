import React from "react";
import {YMaps, Polyline, Placemark} from "@pbe/react-yandex-maps";
import MyMap from "./MyMap";
import {getRandomColor} from "./colors";
function App() {

    const data = [
        {
            "username": "Gleb",
            "movements": [
                [
                    [55.1793863, 30.2037771],
                    [55.1791881, 30.2040322],
                    [55.1791854, 30.2040117],
                    [55.1791829, 30.2040071],
                    [55.179182, 30.2040074],
                ]
            ]
        }
    ]
    return (
    <div className="App">
        <YMaps>
            <MyMap>


                {data.map(user => {

                    let color = getRandomColor()
                    return <div key={user.username}>
                        {user.username} - <div style={{display: "inline-block", width: "10px", height: "10px", backgroundColor: `${color}`}}></div>
                        {user.movements.map((movement, idx) => (
                            <React.Fragment key={idx}>
                                <Polyline
                                    width={10}
                                    geometry={movement}
                                    options={{
                                        strokeWidth: 4,
                                        strokeColor: color
                                    }}
                                    properties={{
                                        hintContent: user.username,
                                    }}
                                    modules={
                                        ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                    }
                                />
                            </React.Fragment>
                        ))}
                        {user.movements.map(mv => {
                            return mv.map((movement, idx) => (<React.Fragment key={idx}>
                              <Placemark
                                  geometry={[movement[0], movement[1]]}
                                  properties={{
                                      hintContent: `id: ${idx}, ${movement[0]} ${movement[1]}`,
                                  }}
                                  options={{
                                      preset: 'islands#blackCircleIcon',
                                  }}

                                  modules={
                                      ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                  }
                              />
                          </React.Fragment>
                            )
                        )})}
                    </div>
                })}
            </MyMap>
        </YMaps>
    </div>
  );
}

export default App;
