import request from '@/utils/request2'

export function getUsersInfo(data) {
  return request({
    url: '/zabbix/get_zabbix_user_info',
    method: 'get',
    params: data
  })
}

export function addUserInfo(data) {
  return request({
    url: '/zabbix/add_zabbix_user_info',
    method: 'post',
    data
  })
}

export function editUserInfo(id, data) {
  return request({
    url: '/zabbix/edit_zabbix_user_info/' + id,
    method: 'put',
    data
  })
}

export function deleteUserInfo(id) {
  return request({
    url: '/zabbix/delete_zabbix_user_info/' + id,
    method: 'delete'
  })
}

export function fetchDepartmentInfo(data) {
  return request({
    url: '/zabbix/fetch_department_info',
    method: 'get',
    params: data
  })
}

export function addDepartmentInfo(data) {
  return request({
    url: '/zabbix/add_department_info',
    method: 'post',
    data
  })
}

export function editDepartmentInfo(id, data) {
  return request({
    url: '/zabbix/edit_department_info/' + id,
    method: 'put',
    data
  })
}

export function deleteDepartmentInfo(id) {
  return request({
    url: '/zabbix/delete_department_info/' + id,
    method: 'delete'
  })
}

export function getVirtualGroup(query) {
  return request({
    url: '/user/get_virtual_group',
    method: 'get',
    params: query
  })
}

export function editVirtualGroup(id, data) {
  return request({
    url: '/user/edit_virtual_group/' + id,
    method: 'put',
    data
  })
}

export function addVirtualGroup(data) {
  return request({
    url: '/user/add_virtual_group',
    method: 'post',
    data
  })
}

export function deleteVirtualGroup(id) {
  return request({
    url: '/user/delete_virtual_group/' + id,
    method: 'delete'
  })
}

export function getUserGroup() {
  return request({
    url: '/zabbix/get_user_info4',
    method: 'get'
  })
}

export function getDepart() {
  return request({
    url: '/zabbix/get_department_info3',
    method: 'get'
  })
}

export function addUuidInfo(data) {
  return request({
    url: '/zabbix/insert_into_uuid',
    method: 'post',
    data
  })
}
