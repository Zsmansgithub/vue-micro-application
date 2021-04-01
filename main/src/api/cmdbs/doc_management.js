import request from '@/utils/request2'

export function fetchAllPackage(params) {
  return request({
    url: '/cmdb/doc_management/',
    method: 'get',
    params: params
  })
}

export function addPackageInfo(data) {
  return request({
    url: '/cmdb/doc_management/',
    method: 'post',
    data
  })
}

export function editPackageInfo(id, data) {
  return request({
    url: '/cmdb/doc_management/' + id + '/',
    method: 'put',
    data
  })
}

export function deletePackageInfo(id) {
  return request({
    url: '/cmdb/doc_management/' + id + '/',
    method: 'delete'
  })
}

export function fetchDocOptions() {
  return request({
    url: '/cmdb/doc_options/',
    method: 'get'
  })
}

export function docDownload(fn) {
  return request({
    url: '/cmdb/doc_download/' + fn + '/',
    method: 'get',
    responseType: 'blob'
  })
}
