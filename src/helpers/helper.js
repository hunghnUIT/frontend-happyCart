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
