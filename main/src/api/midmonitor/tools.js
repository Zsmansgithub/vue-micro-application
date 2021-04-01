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
