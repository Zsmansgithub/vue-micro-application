import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/bastion_host/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/cmdb/bastion_host/',
    method: 'post',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/cmdb/bastion_host/' + row_id + '/',
    method: 'delete'
  })
}

export function editRow(row_id, data) {
  return request({
    url: '/cmdb/bastion_host/' + row_id + '/',
    method: 'put',
    data
  })
}

export function getQueryOptions() {
  return request({
    url: '/cmdb/bastion_query_options/',
    method: 'get'
  })
}

export function getPublicIPOptions() {
  return request({
    url: '/cmdb/bastion_publicip_options/',
    method: 'get'
  })
}

export function bastionAddValidation(params) {
  return request({
    url: '/cmdb/bastion_add_validation/',
    method: 'get',
    params: params
  })
}
