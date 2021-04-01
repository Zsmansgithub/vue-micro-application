import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/resource_opr/',
    method: 'get',
    params: query
  })
}

export function exportList(params) {
  return request({
    url: '/cmdb/resource_opr_export/',
    method: 'get',
    params: params
  })
}
