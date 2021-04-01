
export function format1024(value) {
  if (value < 1024) {
    return value + 'b'
  } else if (value > 1024 && value < 1024 * 1024) {
    const h = parseInt(value / 1024)
    return h + 'K'
  } else if (1024 * 1024 < value && value < 1024 * 1024 * 1024) {
    const h = parseInt(value / 1048576)
    return h + 'M'
  } else if (value > 1024 * 1024 * 1024) {
    const d = parseInt(value / 1073741824)
    return d + 'G'
  }
}

export function isORnot(value) {
  if (value * 1 === 0) {
    return '否'
  } else {
    return '是'
  }
}

export function getQueryVariable() {
  const query_dict = {}
  const query = window.location.search.substring(1)
  console.log(window.lo)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    query_dict[pair[0]] = pair[1]
  }
  return query_dict
}
