const colors = [
    "#FFD700",
    "#8A2BE2",
    "#FF4500",
    "#DC143C",
    "#00CED1",
    "#FF1493",
    "#1E90FF",
    "#FF69B4",
    "#008000",
    "#FF6347",
    "#FFEFD5",
    "#FFF8DC",
    "#FFE4C4",
    "#D2B48C",
    "#C3B091",
    "#8B7969",
    "#A0522D",
    "#CD853F",
    "#DEB887",
    "#F5DEB3"
]
export function getRandomColor(){
    return colors[Math.floor(Math.random() * colors.length)]
}

