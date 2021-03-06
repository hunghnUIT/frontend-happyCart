/**
 * Limit a string if string length is grater then `limitLength`
 * @param {String} str String need to be limit
 * @param {Number} limitLength Optional. Default is 19 character
 * @returns String with the tail "..." if string is limited
 */
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
exports.toVietnameseTimeFormat = function (timestamp, showSecond = false) {
    const hour = Math.floor(timestamp / 3600000) % 24;
    const min = Math.floor(timestamp / 60000) % 60;
    const sec = Math.floor(timestamp / 1000) % 60;

    let result = '';

    if (hour)
        result += `${hour} giờ`;
    if (min) {
        if (result)
            result += ' ';
        result += `${min} phút`;
    }
    if (sec && showSecond) {
        if (result)
            result += ' ';
        result += `${sec} giây`;
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

exports.isLetter = (c) => {
    return RegExp(/^\p{L}/,'u').test(c);
}

exports.parseBoolean = (str) => {
    if (typeof(str) === 'string')
        return JSON.parse(str.toLowerCase());
    else if (typeof(str) === 'boolean')
        return str;
    else {
        console.log(`Parse failed, type: ${typeof(str)}`);
        return null;
    }
}

/**
 * This will return priority of key based on order below, ***this only for sorting key in system setting purpose***
 * @param {String} key key of object
 */
const getKeyDisplayPriority = (key) => {
    // Priority order: chung > api/html crawler > api <ID>
    if (key.includes('chung'))
        return 3;
    else if (/^[a-zA-Z]+$/.test(key)) // Only letter
        return 2;
    else // Letter and number
        return 1;
}

/**
 * Sort object by key priority, the bigger priority will come first
 * @returns Sorted object
 */
exports.sortObjectByKey = obj => Object.keys(obj).sort((a, b) => getKeyDisplayPriority(b) - getKeyDisplayPriority(a)).reduce((res, key) => (res[key] = obj[key], res), {}); //eslint-disable-line