import request from '@/utils/request2'

export function fetchList(query) {
  return request({
    url: '/cmdb/get_vcenter_list',
    method: 'get',
    params: query
  })
}

export function insertVCenter(data) {
  return request({
    url: '/cmdb/add_vcenter_list',
    method: 'post',
    data
  })
}

export function editVCenter(id, data) {
  return request({
    url: '/cmdb/edit_vcenter_id/' + id,
    method: 'put',
    data
  })
}

export function deleteVCenter(id) {
  return request({
    url: '/cmdb/delete_vcenter_id/' + id,
    method: 'delete'
  })
}

export function refreshVCenter(data) {
  return request({
    url: '/cmdb/refresh_vcenter_id',
    method: 'get',
    params: data
  })
}

export function fetchHost(query) {
  return request({
    url: '/cmdb/get_host_list',
    method: 'get',
    params: query
  })
}

export function selectVcenter() {
  return request({
    url: '/cmdb/get_vcenter',
    method: 'get'
  })
}

export function selectCluster() {
  return request({
    url: '/cmdb/get_vc_cluster',
    method: 'get'
  })
}

export function deleteHost(id) {
  return request({
    url: '/cmdb/delete_host_list/' + id,
    method: 'delete'
  })
}

export function fetchCluster(query) {
  return request({
    url: '/cmdb/get_vcenter_cluster',
    method: 'get',
    params: query
  })
}

export function addClusters(data) {
  return request({
    url: '/cmdb/add_vcenter_cluster',
    method: 'post',
    data
  })
}

export function deleteClusters(id) {
  return request({
    url: '/cmdb/delete_vcenter_cluster/' + id,
    method: 'delete'
  })
}

export function editClusters(id, data) {
  return request({
    url: '/cmdb/edit_vcenter_cluster/' + id,
    method: 'put',
    data
  })
}
