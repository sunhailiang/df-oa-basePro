import format from './dateFormater'
function yesterday() {
  var time = new Date().getTime() - 24 * 60 * 60 * 1000
  var yesterday = new Date(time)
  yesterday =
    yesterday.getFullYear() +
    '-' +
    (yesterday.getMonth() > 9 ? yesterday.getMonth() + 1 : '0' + (yesterday.getMonth() + 1)) +
    '-' +
    (yesterday.getDate() > 9 ? yesterday.getDate() : '0' + yesterday.getDate())
  return yesterday
}
function today() {
  var date = new Date()
  date.getFullYear() + date.getMonth() + date.getDate()
  return format('YYYY-mm-dd', date)
}

function tomorrow() {
  var day = new Date()
  day.setTime(day.getTime() + 24 * 60 * 60 * 1000)
  var d = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
  return d
}

export { yesterday, today, tomorrow }
