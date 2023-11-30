

export function convertTimeToLocaleTime(dateStr){
    return new Date(Date.parse(dateStr)).toLocaleTimeString()
}