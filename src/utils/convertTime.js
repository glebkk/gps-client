

export function convertTimeFromIso(dateStr){
    const date = new Date(dateStr);
    return new Date(date.toISOString().slice(0, -1))
}