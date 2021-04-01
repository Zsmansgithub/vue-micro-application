import request from '@/utils/request2'

export function getNginxLogNowList(listQuery) {
  return request({
    url: '/zabbix/nginx_log_now_list',
    method: 'get',
    params: listQuery
  })
}
export function getNginxLogHisLineData(listQuery) {
  return request({
    url: '/zabbix/nginx_log_get_nginx_his_line_data',
    method: 'get',
    params: listQuery
  })
}
export function nginxLogBatchUpdate(listQuery) {
  return request({
    url: '/zabbix/nginx_log_update_url_info',
    method: 'post',
    data: listQuery
  })
}
