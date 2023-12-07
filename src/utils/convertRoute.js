export function convertRouteToArrayCoordinates(movements){
    const coordinates = []
    movements && movements.forEach(movement => {
        coordinates.push([movement.latitude, movement.longitude])
    })
    return coordinates
}