import request from '@/utils/request2'

export function fetchList(query) {
  return request({
    url: '/cmdb/get_resource_list',
    method: 'get',
    params: query
  })
}

export function fetchPyList(query) {
  return request({
    url: 'cmdb/get_resource_py_list/' + query,
    method: 'get'
  })
}

export function fetchVmList(query) {
  return request({
    url: 'cmdb/get_resource_vm_list/' + query,
    method: 'get'
  })
}

export function fetchVmEcsList(query) {
  return request({
    url: 'cmdb/get_resource_vmecs_list/' + query,
    method: 'get'
  })
}

export function updatePyList(data) {
  // request.defaults.headers.common['Content-Type'] = 'application/json';
  return request({
    url: '/cmdb/operation/update',
    method: 'put',
    data
  })
}

export function updategPyList(data) {
  return request({
    url: '/cmdb/operation/updateg',
    method: 'put',
    data
  })
}

export function updatePybaseInfo(data) {
  return request({
    url: '/cmdb/operation/updatebase',
    method: 'put',
    data
  })
}

export function updateVmbaseInfo(data) {
  return request({
    url: '/cmdb/operation/updatevbase',
    method: 'put',
    data
  })
}

export function editIPValidation(params) {
  return request({
    url: '/cmdb/operation/edit_ip_validation/',
    method: 'get',
    params: params
  })
}

export function getFrackList() {
  return request({
    url: '/cmdb/get_frack',
    method: 'get'
  })
}

export function getSupplierList() {
  return request({
    url: '/cmdb/get_supplier',
    method: 'get'
  })
}

export function createRList(data) {
  return request({
    url: '/cmdb/operation/bulk',
    method: 'post',
    data
  })
}

export function getClusterList() {
  return request({
    url: '/cmdb/get_cluster_list',
    method: 'get'
  })
}

export function getIpList() {
  return request({
    url: '/cmdb/get_db_ip_list',
    method: 'get'
  })
}

export function bulkUpdate(data) {
  return request({
    url: '/cmdb/update_rs_info',
    method: 'put',
    data
  })
}

export function getScrapMachine(params) {
  return request({
    url: '/cmdb/get_scrap_machine/',
    method: 'get',
    params: params
  })
}

export function handleDeleteMachine(data) {
  return request({
    url: '/cmdb/handle_delete_machine/',
    method: 'post',
    data
  })
}

export function exportList(params) {
  return request({
    url: '/cmdb/export/',
    method: 'get',
    params: params
    // responseType: 'blob'
  })
}

export function exportIsready(data) {
  return request({
    url: '/cmdb/export_isready/',
    method: 'post',
    data
  })
}

export function exportFile(data) {
  return request({
    url: '/cmdb/export_file/',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function addValidation(params) {
  return request({
    url: '/cmdb/change_ip_validation/',
    method: 'get',
    params: params
  })
}

export function changeIp(data) {
  return request({
    url: '/cmdb/change_ip/',
    method: 'post',
    data
  })
}
