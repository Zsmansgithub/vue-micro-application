import request from '@/utils/request2'

export function getAlarmHistory(listQuery) {
  return request({
    url: '/zabbix/sql_monitor_alarm_history',
    method: 'get',
    params: listQuery
  })
}

