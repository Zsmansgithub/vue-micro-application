import request from '@/utils/request2'

export function change_duty_table(data) {
  return request({
    url: '/cmdb/change_duty_table/',
    method: 'post',
    data
  })
}
export function get_duty_table(query) {
  return request({
    url: '/cmdb/change_duty_table',
    method: 'get',
    params: query
  })
}
// 导出
export function export_duty_table(data) {
  return request({
    url: '/cmdb/export_duty_table/',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 导入
export function input_duty_table(data, headers) {
  return request({
    url: '/cmdb/input_duty_table/',
    method: 'post',
    headers,
    data
  })
}
