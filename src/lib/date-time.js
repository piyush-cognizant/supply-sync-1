/*
* @params utc: UTC time string
* @params timeZone: Target time zone (default is "IST")
* @returns Local time string in the specified time zone
*/
const convertToLocalTime = (utc, timeZone = "IST") => {
    try {
        const date = new Date(utc);
        const options = {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Intl.DateTimeFormat([], options).format(date);
    } catch (error) {
        console.error("Error converting time:", error);
        return null;
    }
}

/*
* @params localTime: Local time string
* @params keepMilliseconds: Boolean to indicate if milliseconds should be kept (default is false)
* @returns UTC time string
*/
const convertToUTC = (localTime, keepMilliseconds = false) => {
    try {
        const date = new Date(localTime);
        if (keepMilliseconds) {
            return date.toISOString();
        } else {
            return date.toISOString().split('.')[0] + 'Z';
        }
    } catch (error) {
        console.error("Error converting to UTC:", error);
        return null;
    }
}

/*
* @returns Current UTC time string
*/
const getCurrentUTC = () => {
    const now = new Date();
    return now.toISOString().split('.')[0] + 'Z';
}

export { convertToLocalTime, convertToUTC, getCurrentUTC };