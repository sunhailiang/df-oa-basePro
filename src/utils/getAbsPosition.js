// 获取距离屏幕左边的绝对距离
function getAbsLeft(obj) {
  var l = obj.offsetLeft
  while (obj.offsetParent != null) {
    obj = obj.offsetParent
    l += obj.offsetLeft
  }
  return l
}
// 获取距离屏幕上边的绝对距离
function getAbsTop(obj) {
  var top = obj.offsetTop
  while (obj.offsetParent != null) {
    obj = obj.offsetParent
    top += obj.offsetTop
  }
  return top
}
export { getAbsTop, getAbsLeft }
