export function timestampToTimeStr(timestamp, need_second) {
  // 时间戳转时间字符串
  const date = timestamp ? new Date(timestamp) : new Date()
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  const h = ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
  const m = ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  const s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  if (!need_second) {
    return Y + M + D + h + m
  } else {
    return Y + M + D + h + m + s
  }
}

export function get_array_dict_value(array_dict, key, reverse) {
  if (!reverse) {
    for (const i of array_dict) {
      if (i[0] === key) {
        return i[1]
      }
    }
  } else {
    for (const i of array_dict) {
      if (i[1] === key) {
        return i[0]
      }
      console.log(key)
      console.log(i[1])
    }
  }
}
