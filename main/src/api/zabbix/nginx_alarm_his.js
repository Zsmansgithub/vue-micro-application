import request from '@/utils/request2'

export function getNginxAlarmHis(listQuery) {
  return request({
    url: '/zabbix/nginx_log_get_alarm_his',
    method: 'get',
    params: listQuery
  })
}


