import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/infrastructure/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/cmdb/infrastructure/',
    method: 'post',
    data
  })
}

export function deleteRow(device_num) {
  return request({
    url: '/cmdb/infrastructure/' + device_num + '/',
    method: 'delete'
  })
}

export function editRow(device_num, data) {
  return request({
    url: '/cmdb/infrastructure/' + device_num + '/',
    method: 'put',
    data
  })
}

export function getQueryOptions() {
  return request({
    url: '/cmdb/infra_query_options/',
    method: 'get'
  })
}

export function exportList(params) {
  return request({
    url: '/cmdb/infra_export/',
    method: 'get',
    params: params
  })
}
