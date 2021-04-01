import request from '@/utils/request2'

export function getAlarmHistory(query) {
  return request({
    url: '/zabbix/alarm_history_list',
    method: 'get',
    params: query
  })
}

export function getAlarmEvent(query) {
  return request({
    url: '/zabbix/get_alarm_event',
    method: 'get',
    params: query
  })
}

export function updateAlarmEvent(row_id, data) {
  data['is_ack'] = 1
  return request({
    url: '/zabbix/update_alarm_event/' + row_id,
    method: 'put',
    data
  })
}
export function uaeBatchAck(query) {
  return request({
    url: '/zabbix/update_alarm_event_batch_ack',
    method: 'get',
    params: query
  })
}

export function getAlarmUserConf(query) {
  return request({
    url: '/zabbix/alarm_user_conf',
    method: 'get',
    params: query
  })
}
export function getNodeConf() {
  return request({
    url: '/zabbix/get_node_conf',
    method: 'get'
  })
}

export function addTriggersConf(data) {
  return request({
    url: '/zabbix/add_trigger_conf',
    method: 'post',
    data
  })
}

export function getTriggersConf(query) {
  return request({
    url: '/zabbix/get_trigger_conf',
    method: 'get',
    params: query
  })
}

export function updateTriggersConf(id, data) {
  return request({
    url: '/zabbix/update_trigger_conf/' + id,
    method: 'put',
    data
  })
}

export function deleteTriggersConf(id) {
  return request({
    url: '/zabbix/delete_trigger_conf/' + id,
    method: 'delete'
  })
}

export function getTemplateByNodeId(params) {
  return request({
    url: '/zabbix/trigger_conf_get_template_by_node_id',
    method: 'get',
    params: params
  })
}

export function addUserConf(data) {
  return request({
    url: '/zabbix/add_user_conf',
    method: 'post',
    data
  })
}

export function editUserConf(row_id, data) {
  return request({
    url: '/zabbix/edit_alarm_user_conf/' + row_id,
    method: 'put',
    data
  })
}

export function deleteUserConf(row_id) {
  return request({
    url: '/zabbix/delete_user_conf/' + row_id,
    method: 'delete'
  })
}

export function updateAlarmHistory(id, data) {
  data['is_ack'] = 1
  return request({
    url: '/zabbix/edit_alarm_history/' + id,
    method: 'put',
    data
  })
}

export function getTriggersTemplate(listQuery) {
  return request({
    url: '/zabbix/triggers_template_list',
    method: 'get',
    params: listQuery
  })
}

export function createTriggersTemplate(post_data) {
  return request({
    url: '/zabbix/triggers_template_create',
    method: 'post',
    data: post_data
  })
}

export function editTriggersTemplate(put_data, pk) {
  return request({
    url: '/zabbix/triggers_template_update/' + pk,
    method: 'put',
    data: put_data
  })
}

export function deleteTriggersTemplate(pk) {
  return request({
    url: '/zabbix/triggers_template_delete/' + pk,
    method: 'delete'
  })
}

export function aucAddContacts(query) {
  return request({
    url: '/zabbix/alarm_user_conf_add_contacts',
    method: 'post',
    data:query
  })
}
export function getAllAlarmUsers(params) {
  return request({
    url: '/zabbix/alarm_user_conf_get_all_alarm_users',
    method: 'get',
    params: params
  })
}
export function aucDeleteContacts(query) {
  return request({
    url: '/zabbix/alarm_user_conf_delete_contacts',
    method: 'post',
    data:query
  })
}
