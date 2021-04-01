import request from '@/utils/request2'

export function getTriggerList(listQuery) {
  return request({
    url: '/zabbix/sql_monitor_trigger_list',
    method: 'get',
    params: listQuery
  })
}

export function createTrigger(post_data) {
  return request({
    url: '/zabbix/sql_monitor_trigger_create',
    method: 'post',
    data: post_data
  })
}

export function editTrigger(put_data, pk) {
  return request({
    url: '/zabbix/sql_monitor_trigger_update/' + pk,
    method: 'put',
    data: put_data
  })
}

export function deleteTrigger(pk) {
  return request({
    url: '/zabbix/sql_monitor_trigger_delete/' + pk,
    method: 'delete'
  })
}

export function testExpression(data) {
  return request({
    url: '/zabbix/sql_monitor_trigger_test_expression',
    method: 'get',
    params: data
  })
}

export function getTriggerNameList(post_data) {
  return request({
    url: '/zabbix/sql_monitor_get_trigger_name_list',
    method: 'post',
    data: post_data
  })
}

export function getTaskNameList() {
  return request({
    url: '/zabbix/sql_monitor_get_task_name_list',
    method: 'get'
  })
}

