import request from '@/utils/request2'

export function fetchList(query) {
  return request({
    url: '/zabbix/get_db',
    method: 'get',
    params: query
  })
}

export function fetchAlarmList(query) {
  return request({
    url: '/zabbix/get_alarm',
    method: 'get',
    params: query
  })
}

export function fetchMysql(query) {
  return request({
    url: '/cmdb/get_mysql_list',
    method: 'get',
    params: query
  })
}

export function addMysql(data) {
  return request({
    url: '/cmdb/add_mysql_list',
    method: 'post',
    data
  })
}

export function editMysql(row_id, data) {
  return request({
    url: '/cmdb/edit_mysql_list/' + row_id,
    method: 'put',
    data
  })
}

export function deleteMysql(row_id) {
  return request({
    url: '/cmdb/delete_mysql_list/' + row_id,
    method: 'delete'
  })
}

export function fetchDb() {
  return request({
    url: '/cmdb/get_db_lists',
    method: 'get'
  })
}

export function fetchDbName() {
  return request({
    url: '/cmdb/get_db_name_lists',
    method: 'get'
  })
}

export function fetchTableName() {
  return request({
    url: '/cmdb/get_table_name',
    method: 'get'
  })
}

export function fetchDbTable() {
  return request({
    url: '/cmdb/get_db_table_cascader',
    method: 'get'
  })
}

export function addInstance(data) {
  return request({
    url: '/cmdb/add_instance_list',
    method: 'post',
    data
  })
}

export function editInstance(row_id, data) {
  return request({
    url: '/cmdb/edit_instance_list/' + row_id,
    method: 'put',
    data
  })
}

export function deleteInstance(row_id) {
  return request({
    url: '/cmdb/delete_instance_list/' + row_id,
    method: 'delete'
  })
}

