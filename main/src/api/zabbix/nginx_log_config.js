import request from '@/utils/request2'

export function getNginxLogConfigList(listQuery) {
  return request({
    url: '/zabbix/nginx_log_config_curd/',
    method: 'get',
    params: listQuery
  })
}

export function createNewNginxConfig(listQuery) {
  return request({
    url: '/zabbix/nginx_log_config_curd/',
    method: 'post',
    data: listQuery
  })
}
export function deleteNginxConfig(pk) {
  return request({
    url: '/zabbix/nginx_log_config_curd/' + pk,
    method: 'delete'
  })
}
export function editNginxConfig(put_data, pk) {
  return request({
    url: '/zabbix/nginx_log_config_curd/' + pk,
    method: 'put',
    data: put_data
  })
}
export function nginxLogBatchUpdate(listQuery) {
  return request({
    url: '/zabbix/nginx_log_config_batch_update',
    method: 'post',
    data: listQuery
  })
}
