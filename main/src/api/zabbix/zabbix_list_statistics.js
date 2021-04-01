import request from '@/utils/request2'

export function zsGetBaseData(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_base_data',
    method: 'get',
    params: listQuery
  })
}

export function zsGetAlarmHisLine(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_alarm_his_line',
    method: 'get',
    params: listQuery
  })
}

export function zsGetTableData(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_table_data',
    method: 'get',
    params: listQuery
  })
}

export function zsGetCpuTop10(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_cpu_top_10',
    method: 'get',
    params: listQuery
  })
}

export function zsGetMemTop10(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_mem_top_10',
    method: 'get',
    params: listQuery
  })
}

export function zsGetRootTop10(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_root_top_10',
    method: 'get',
    params: listQuery
  })
}

export function zsGetDataTop10(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_data_top_10',
    method: 'get',
    params: listQuery
  })
}

export function zsGetNetInTop10(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_net_in_top_10',
    method: 'get',
    params: listQuery
  })
}

export function zsGetNetOutTop10(listQuery) {
  return request({
    url: '/zabbix/zabbix_statistics_get_net_out_top_10',
    method: 'get',
    params: listQuery
  })
}
