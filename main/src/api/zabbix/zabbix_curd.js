import request from '@/utils/request2'

export function getZabbixHostList(listQuery) {
  return request({
    url: '/zabbix/zabbix_curd_get_all_hosts',
    method: 'get',
    params: listQuery
  })
}

export function getLoginApiTrendData(listQuery) {
  return request({
    url: '/zabbix/get_login_trend_line_data',
    method: 'get',
    params: listQuery
  })
}

export function getGroupsProxiesTemplates() {
  return request({
    url: '/zabbix/zabbix_curd_get_groups_proxies_templates',
    method: 'get',

  })
}

export function createZabbixHost(post_data) {
  return request({
    url: '/zabbix/zabbix_curd_create_host',
    method: 'post',
    data: post_data
  })
}

export function zabbixCurdBatchChangeStatus(post_data) {
  return request({
    url: '/zabbix/zabbix_curd_batch_change_status',
    method: 'post',
    data: post_data
  })
}

export function updateZabbixHost(put_data, pk) {
  return request({
    url: '/zabbix/zabbix_curd_update_host/' + pk,
    method: 'put',
    data: put_data
  })
}

export function deleteZabbixHost(pk) {
  return request({
    url: '/zabbix/zabbix_curd_delete_host/' + pk,
    method: 'delete'
  })
}

export function batchDeleteZabbixHost(pks) {
  return request({
    url: '/zabbix/zabbix_curd_batch_delete_host',
    method: 'post',
    data: pks
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

