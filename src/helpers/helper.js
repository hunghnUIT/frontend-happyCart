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

exports.generateSlug = (str, separator) => {
    str = str
        .toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, "-")
        .replace(/[^A-Za-z0-9_-]/g, "")
        .replace(/-+/g, "-");
    if (separator) {
        return str.replace(/-/g, separator);
    }
    return str;
}