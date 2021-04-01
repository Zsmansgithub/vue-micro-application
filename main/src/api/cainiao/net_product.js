import request from '@/utils/request2'

export function fetchNetProduct(query) {
  return request({
    url: '/cainiao/get_net_product',
    method: 'get',
    params: query
  })
}

export function addNetProduct(data) {
  return request({
    url: '/cainiao/add_net_product',
    method: 'post',
    data
  })
}

export function editNetProduct(id, data) {
  return request({
    url: '/cainiao/edit_net_product/' + id,
    method: 'put',
    data
  })
}

export function deleteNetProduct(id) {
  return request({
    url: '/cainiao/delete_net_product/' + id,
    method: 'delete'
  })
}

export function getUnitPlate() {
  return request({
    url: '/cainiao/get_unit_plate_only',
    method: 'get'
  })
}

export function getNetProductName(query) {
  return request({
    url: '/cainiao/get_net_product_name',
    method: 'post',
    data: query
  })
}
