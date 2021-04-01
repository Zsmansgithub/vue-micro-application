import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/zabbix/url_monitor/',
    method: 'get',
    params: query
  })
}

// export function getFirstLevel(query) {
//   return request({
//     url: '/zabbix/url_get_first_level/',
//     method: 'get',
//     params: query
//   })
// }
//
// export function getSecondLevel(query) {
//   return request({
//     url: '/zabbix/url_get_second_level/',
//     method: 'get',
//     params: query
//   })
// }
