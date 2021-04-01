import request from '@/utils/request2'

export function getDatabaseInfoList(listQuery) {
  return request({
    url: '/zabbix/sql_monitor_database_list',
    method: 'get',
    params: listQuery
  })
}

export function createNewDatabaseInfo(post_data) {
  return request({
    url: '/zabbix/sql_monitor_database_create',
    method: 'post',
    data: post_data
  })
}

export function editDatabaseInfo(put_data, pk) {
  return request({
    url: '/zabbix/sql_monitor_database_update/' + pk,
    method: 'put',
    data: put_data
  })
}

export function deleteDatabaseInfo(pk) {
  return request({
    url: '/zabbix/sql_monitor_database_delete/' + pk,
    method: 'delete'
  })
}

export function batchUpdateDatabaseInfo(data) {
  return request({
    url: '/zabbix/sql_monitor_database_batch_update',
    method: 'post',
    data
  })
}

export function testSqlConnect(post_data) {
  return request({
    url: '/zabbix/sql_monitor_test_sql_connect',
    method: 'post',
    data: post_data
  })
}

export function getLevelCascade() {
  return request({
    url: '/zabbix/sql_monitor_get_level_cascade',
    method: 'get'
  })
}

export function getDbType(p) {
  return request({
    url: '/zabbix/sql_monitor_get_db_type',
    method: 'get',
    params: p
  })
}

export function batchBindFromDbInfo(data) {
  return request({
    url: '/zabbix/sql_monitor_batch_bind_from_db_info',
    method: 'post',
    data: data
  })
}

export function batchBindTask(data) {
  return request({
    url: '/zabbix/sql_monitor_batch_bind_task',
    method: 'post',
    data: data
  })
}

export function clickCeleryRestart(data) {
  return request({
    url: '/zabbix/sql_monitor_click_celery_restart',
    method: 'get',
    params: data
  })
}
