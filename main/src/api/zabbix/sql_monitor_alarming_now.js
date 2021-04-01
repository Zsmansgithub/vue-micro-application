import request from '@/utils/request2'

export function getAlarmingList(listQuery) {
  return request({
    url: '/zabbix/sql_monitor_alarming_list',
    method: 'get',
    params: listQuery
  })
}

// export function createAlarm(post_data) {
//   return request({
//     url: '/zabbix/sql_monitor_alarm_create',
//     method: 'post',
//     data: post_data
//   })
// }
//
// export function editAlarm(put_data, pk) {
//   return request({
//     url: '/zabbix/sql_monitor_alarm_update/' + pk,
//     method: 'put',
//     data: put_data
//   })
// }
//
// export function deleteAlarm(pk) {
//   return request({
//     url: '/zabbix/sql_monitor_alarm_delete/' + pk,
//     method: 'delete'
//   })
// }
//
// export function getAlarmNameList() {
//   return request({
//     url: '/zabbix/sql_monitor_get_alarm_name_list',
//     method: 'get'
//   })
// }
//
// export function getAlarmPhoneList() {
//   return request({
//     url: '/zabbix/sql_monitor_get_alarm_phone_list',
//     method: 'get'
//   })
// }
