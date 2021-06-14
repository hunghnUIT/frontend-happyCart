exports.limitDisplayString = (str = "", limitLength = 19) => {
    if (str.length <= limitLength)
        return str;
    else
        return str.substring(0, limitLength) + '...';
}

exports.formatCurrency = (value, currency = 'VND') => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency }).format(value)
}

exports.formatDateTime = (date, formatRegion = 'en-GB') => {
    const dateTime = new Date(date);
    return dateTime.toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
}

/**
 * Convert a timestamp into human readable format (HH:MM:SS)
 * @param {number} timestamp in millisecond
 * @returns String of time in human readable format
 */
exports.toHumanReadableTimeFormat = function (timestamp) {
    const hour = Math.floor(timestamp / 3600000) % 24;
    const min = Math.floor(timestamp / 60000) % 60;
    const sec = Math.floor(timestamp / 1000) % 60;
    let result = '';

    result += `${hour < 10 ? '0' : ''}${hour}:`;
    result += `${min < 10 ? '0' : ''}${min}:`;
    result += `${sec < 10 ? '0' : ''}${sec}`;

    return result;
}

/**
 * Convert a timestamp into Vietnamese language
 * @param {number} timestamp in millisecond
 * @returns String of time in human readable format
 */
module.exports.toVietnameseTimeFormat = function (timestamp) {
    const hour = Math.floor(timestamp / 3600000) % 24;
    const min = Math.floor(timestamp / 60000) % 60;

    let result = '';

    if (hour)
        result += `${hour} giờ`;
    if (min) {
        if (result)
            result += ' ';
        result += `${min} phút`;
    }

    return result;
}

/**
 * Calculate percent
 * @param {Number} num Number for calculating percentage
 * @param {Number} total Total 
 * @returns float
 */
exports.calculatePercent = (num, total) => {
    return Number((num / total * 100).toFixed(1));
}

exports.formatNumber = (number) => new Intl.NumberFormat('de-DE').format(number);

exports.capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}