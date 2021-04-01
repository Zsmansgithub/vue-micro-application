import request from '@/utils/request2'

export function getPortConfigList(listQuery) {
  return request({
    url: '/zabbix/port_monitor_config_curd/',
    method: 'get',
    params: listQuery
  })
}

export function createNewPortConfig(listQuery) {
  return request({
    url: '/zabbix/port_monitor_config_curd/',
    method: 'post',
    data: listQuery
  })
}
export function deletePortConfig(pk) {
  return request({
    url: '/zabbix/port_monitor_config_curd/' + pk,
    method: 'delete'
  })
}
export function editPortConfig(put_data, pk) {
  return request({
    url: '/zabbix/port_monitor_config_curd/' + pk,
    method: 'put',
    data: put_data
  })
}
export function portConfigBatchUpdate(listQuery) {
  return request({
    url: '/zabbix/port_monitor_config_batch_update',
    method: 'post',
    data: listQuery
  })
}
