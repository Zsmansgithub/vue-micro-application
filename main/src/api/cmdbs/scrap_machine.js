import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/scrap_machine/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/cmdb/scrap_machine/',
    method: 'post',
    data
  })
}

export function deleteRow(rid) {
  return request({
    url: '/cmdb/scrap_machine/' + rid + '/',
    method: 'delete'
  })
}

export function editRow(rid, data) {
  return request({
    url: '/cmdb/scrap_machine/' + rid + '/',
    method: 'put',
    data
  })
}

export function exportList(params) {
  return request({
    url: '/cmdb/scrap_export/',
    method: 'get',
    params: params
  })
}

export function getSupplier() {
  return request({
    url: '/cmdb/get_supplier',
    method: 'get'
  })
}
