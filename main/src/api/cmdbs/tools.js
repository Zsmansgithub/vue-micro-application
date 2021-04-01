import request from '@/utils/request2'

export function updatePyList(data) {
  // request.defaults.headers.common['Content-Type'] = 'application/json';
  return request({
    url: '/cmdb/operation/update',
    method: 'put',
    data
  })
}

export function createRList(data) {
  return request({
    url: '/cmdb/operation/bulk',
    method: 'post',
    data
  })
}

export function getSystemVersionList() {
  return request({
    url: '/cmdb/get_system_version',
    method: 'get'
  })
}

export function getSystemVersionList2() {
  return request({
    url: '/cmdb/get_workflow_version',
    method: 'get'
  })
}

export function getSystemVersionList3() {
  return request({
    url: '/cmdb/get_system_version_physic',
    method: 'get'
  })
}

export function fetchAllPackage(data) {
  return request({
    url: '/cmdb/fetch_all_package',
    method: 'get',
    params: data
  })
}

export function addPackageInfo(data) {
  return request({
    url: '/cmdb/add_package_info',
    method: 'post',
    data
  })
}

export function editPackageInfo(id, data) {
  return request({
    url: '/cmdb/edit_package_info/' + id,
    method: 'put',
    data
  })
}

export function deletePackageInfo(id) {
  return request({
    url: '/cmdb/delete_package_info/' + id,
    method: 'delete'
  })
}
