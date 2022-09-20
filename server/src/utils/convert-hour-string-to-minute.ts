

export function convertHrsStringToMin(hourString:string) {
    const[hours, minutes] = hourString.split(':').map(Number)
    const minAmount = (hours* 60)+ minutes;
    return minAmount;
}