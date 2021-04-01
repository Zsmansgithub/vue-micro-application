import request from '@/utils/request2'

export function fetchList(query) {
  return request({
    url: '/cmdb/get_server_list',
    method: 'get',
    params: query
  })
}

export function fetchProjectAppList(query) {
  return request({
    url: '/cmdb/get_project_app_list',
    method: 'get'
  })
}

export function fetchAppInfo(query) {
  return request({
    url: '/cmdb/get_app_by_id/' + query,
    method: 'get'
  })
}

export function fetchPoolInfo() {
  return request({
    url: '/cmdb/get_pool_list',
    method: 'get'
  })
}

export function fetchUserInfo(user) {
  return request({
    url: '/cmdb/get_user_list?user=' + user,
    method: 'get'

  })
}

export function fetchOpsUserInfo() {
  return request({
    url: '/cmdb/get_user_list',
    method: 'get'
  })
}

export function updateApp(id, data) {
  return request({
    url: '/cmdb/update_app/' + id,
    method: 'put',
    data
  })
}

export function createApp(data) {
  return request({
    url: '/cmdb/create_app',
    method: 'post',
    data
  })
}

export function createRList(data) {
  return request({
    url: '/cmdb/bulk_create_app',
    method: 'post',
    data
  })
}

export function bulkUpdateApp(data) {
  return request({
    url: '/cmdb/bulk_update_app/',
    method: 'put',
    data
  })
}

export function deleteAppRow(id) {
  return request({
    url: '/cmdb/delete_app/' + id + '/',
    method: 'delete'
  })
}

export function getHostTotal() {
  return request({
    url: '/cmdb/get_host_total/',
    method: 'get'
  })
}

export function exportList(params) {
  return request({
    url: '/cmdb/app_export/',
    method: 'get',
    params: params
  })
}

export function appValidation(params) {
  return request({
    url: '/cmdb/app_validation/',
    method: 'get',
    params: params
  })
}

export function getAppIPs(params) {
  return request({
    url: '/cmdb/get_app_ips/',
    method: 'get',
    params: params
  })
}
