exports.formatDate = (date) => {
    if(date !== undefined)
        return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
}