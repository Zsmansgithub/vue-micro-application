import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/multi_app_conf/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/cmdb/multi_app_conf/',
    method: 'post',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/cmdb/multi_app_conf/' + row_id + '/',
    method: 'delete'
  })
}

export function editRow(row_id, data) {
  return request({
    url: '/cmdb/multi_app_conf/' + row_id + '/',
    method: 'put',
    data
  })
}

export function getMultiAppLocal() {
  return request({
    url: '/cmdb/get_multi_app_local/',
    method: 'get'
  })
}

export function getMultiApp() {
  return request({
    url: '/cmdb/get_multi_app/',
    method: 'get'
  })
}

export function getMultiAppIP() {
  return request({
    url: '/cmdb/get_multi_app_ip/',
    method: 'get'
  })
}

export function addValidation(params) {
  return request({
    url: '/cmdb/multi_app_add_validation/',
    method: 'get',
    params: params
  })
}

export function addValidationSit(params) {
  return request({
    url: '/cmdb/multi_app_add_validation_sit/',
    method: 'get',
    params: params
  })
}

export function addValidationUat(params) {
  return request({
    url: '/cmdb/multi_app_add_validation_uat/',
    method: 'get',
    params: params
  })
}
