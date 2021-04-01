import request from '@/utils/request2'

export function fetchList(query) {
  return request({
    url: '/zabbix/get_db',
    method: 'get',
    params: query
  })
}

export function fetchAlarmPie() {
  return request({
    url: 'zabbix/get_alarm_pie',
    method: 'get'
  })
}

export function fetchAlarmBar() {
  return request({
    url: 'zabbix/alarm_views_get_dashboard_stack_bar_data',
    method: 'get'
  })
}

export function fetchAlarmPie2() {
  return request({
    url: 'zabbix/get_alarm_pie2',
    method: 'get'
  })
}

export function fetchDbCluster(query) {
  return request({
    url: '/zabbix/get_db_cluster',
    method: 'get',
    params: query
  })
}

export function editDbCluster(id, data) {
  return request({
    url: '/zabbix/edit_db_cluster/' + id,
    method: 'put',
    data
  })
}

export function deleteDbCluster(id) {
  return request({
    url: '/zabbix/delete_db_cluster/' + id,
    method: 'delete'
  })
}

export function fetchZabbixDb(query) {
  return request({
    url: '/zabbix/get_zabbix_db',
    method: 'get',
    params: query
  })
}

export function dbClusterCreate(data) {
  return request({
    url: `/zabbix/db_cluster_add_new`,
    method: 'post',
    data
  })
}

export function dbClusterBatchCreate(data) {
  return request({
    url: `/zabbix/db_cluster_batch_create`,
    method: 'post',
    data
  })
}

export function dbClusterBatchUpdate(data) {
  return request({
    url: `/zabbix/db_cluster_batch_update`,
    method: 'put',
    data
  })
}
export function getDbManagers() {
  return request({
    url: `/zabbix/db_cluster_get_db_managers`,
    method: 'get'
  })
}

export function getDbJinliList() {
  return request({
    url: `/zabbix/db_cluster_get_db_jinli_list`,
    method: 'get'
  })
}

export function exportMysqlData() {
  return request({
    url: `/zabbix/db_cluster_export_mysql_data`,
    method: 'get'
  })
}

