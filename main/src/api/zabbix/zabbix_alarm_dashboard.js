import request from '@/utils/request2'

export function zaGetBaseData(listQuery) {
  return request({
    url: '/zabbix/zabbix_alarm_dashboard_get_base_data',
    method: 'get',
    params: listQuery
  })
}


