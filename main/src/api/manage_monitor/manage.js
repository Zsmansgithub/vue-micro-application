import request from '@/utils/request2'

export function getAppTableConf(data) {
  return request({
    url: '/zabbix/get_apptable_conf',
    method: 'get',
    params: data
  })
}

export function editAppTableConf(id, data) {
  return request({
    url: '/zabbix/edit_apptable_conf/' + id,
    method: 'put',
    data
  })
}

export function addAppTable(data) {
  return request({
    url: '/zabbix/add_apptable_conf',
    method: 'post',
    data
  })
}

export function deleteAppTable(id) {
  return request({
    url: '/zabbix/delete_apptable_conf/' + id,
    method: 'delete'
  })
}

export function fetchNodeConf(data) {
  return request({
    url: '/zabbix/fetch_node_conf',
    method: 'get',
    params: data
  })
}

export function fetchAppTable() {
  return request({
    url: '/zabbix/fetch_app_table',
    method: 'get'
  })
}

export function fetchNodename() {
  return request({
    url: '/zabbix/get_node_name_table',
    method: 'get'
  })
}

export function addNodeConf(data) {
  return request({
    url: '/zabbix/add_node_conf',
    method: 'post',
    data
  })
}

export function editNodeConf(id, data) {
  return request({
    url: '/zabbix/edit_node_conf/' + id,
    method: 'put',
    data
  })
}

export function deleteNodeConf(id) {
  return request({
    url: '/zabbix/delete_node_conf/' + id,
    method: 'delete'
  })
}

export function fetchUserPermission(query) {
  return request({
    url: '/user/fetch_user_permission',
    method: 'get',
    params: query
  })
}

export function fetchAuthUser() {
  return request({
    url: '/user/fetch_auth_user',
    method: 'get'
  })
}

export function fetchAuthGroup() {
  return request({
    url: '/user/fetch_auth_group',
    method: 'get'
  })
}

export function addUserGroup(data) {
  return request({
    url: '/user/add_user_group',
    method: 'post',
    data
  })
}

export function editUserGroup(data) {
  return request({
    url: '/user/edit_user_group',
    method: 'get',
    params: data
  })
}

export function deleteUserGroup(data) {
  return request({
    url: '/user/delete_user_group',
    method: 'get',
    params: data
  })
}

export function fetchGroupAll() {
  return request({
    url: 'user/get_group_all',
    method: 'get'
  })
}

export function fetchGroup(data) {
  return request({
    url: '/user/fetch_group',
    method: 'get',
    params: data
  })
}

export function addGroup(data) {
  return request({
    url: '/user/add_group',
    method: 'post',
    data
  })
}

export function editGroup(data) {
  return request({
    url: '/user/edit_group',
    method: 'post',
    data
  })
}
