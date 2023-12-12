import {format} from "date-fns";

export function convertTimeToLocaleTime(dateStr){
    return new Date(Date.parse(dateStr)).toLocaleTimeString()
}

export function getDiffBetweenDates(date1, date2){
    const dateone = new Date(date1);
    const datetwo = new Date(date2);

    var timeDiff = Math.abs(dateone.getTime() - datetwo.getTime());

// Convert the time difference to hh:mm:ss format
    var diffHours = Math.floor(timeDiff / (1000 * 60 * 60));
    var diffMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    var diffSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

// Format the result as a string
    return diffHours.toString().padStart(2, '0') + ':' +
        diffMinutes.toString().padStart(2, '0') + ':' +
        diffSeconds.toString().padStart(2, '0');
}