import request from '@/utils/request2'

export function getTasksInfoList(listQuery) {
  return request({
    url: '/zabbix/sql_monitor_tasks_list',
    method: 'get',
    params: listQuery
  })
}

export function createNewTasksInfo(post_data) {
  return request({
    url: '/zabbix/sql_monitor_tasks_create',
    method: 'post',
    data: post_data
  })
}

export function createNewTasksWithoutBind(post_data) {
  return request({
    url: '/zabbix/sql_monitor_tasks_create_without_bind',
    method: 'post',
    data: post_data
  })
}

export function editTasksInfo(put_data, pk) {
  return request({
    url: '/zabbix/sql_monitor_tasks_update/' + pk,
    method: 'put',
    data: put_data
  })
}

export function deleteTasksInfo(pk) {
  return request({
    url: '/zabbix/sql_monitor_tasks_delete/' + pk,
    method: 'delete'
  })
}

export function getDatabaseList() {
  return request({
    url: '/zabbix/sql_monitor_get_database_list',
    method: 'get'
  })
}

export function testSqlSentence(post_data) {
  return request({
    url: '/zabbix/sql_monitor_test_sql_sentence',
    method: 'post',
    data: post_data
  })
}

export function bandIpList(post_data) {
  return request({
    url: '/zabbix/sql_monitor_band_ip_list',
    method: 'post',
    data: post_data
  })
}

export function changeActive(post_data) {
  return request({
    url: '/zabbix/sql_monitor_change_active',
    method: 'post',
    data: post_data
  })
}

export function testTriggerUseful(post_data) {
  return request({
    url: '/zabbix/sql_monitor_test_trigger_useful',
    method: 'post',
    data: post_data
  })
}

export function getInnerLineChart(data) {
  return request({
    url: '/zabbix/sql_monitor_get_inner_line_chart',
    method: 'get',
    params: data
  })
}

export function InnerUnbind(data) {
  return request({
    url: '/zabbix/sql_monitor_inner_unbind',
    method: 'get',
    params: data
  })
}

export function getDbNameList() {
  return request({
    url: '/zabbix/sql_monitor_get_db_name_list',
    method: 'get'
  })
}

export function getTaskNameTransferLeft() {
  return request({
    url: '/zabbix/sql_monitor_get_task_name_transfer_left',
    method: 'get'
  })
}
