import request from '@/utils/request2'

export function fetchLoadBalanceList(query) {
  return request({
    url: '/cainiao/get_load_balance',
    method: 'get',
    params: query
  })
}

export function addLoadBalanceList(data) {
  return request({
    url: '/cainiao/add_load_balance',
    method: 'post',
    data
  })
}

export function deleteLoadBalanceList(data) {
  return request({
    url: '/cainiao/delete_load_balance',
    method: 'delete',
    data
  })
}

export function editLoadBalanceList(id, data) {
  return request({
    url: '/cainiao/edit_load_balance/' + id,
    method: 'put',
    data
  })
}

export function fetchLoadPoolList(query) {
  return request({
    url: '/cainiao/get_load_balance_pool',
    method: 'get',
    params: query
  })
}

export function addLoadPoolList(data) {
  return request({
    url: '/cainiao/add_load_balance_pool',
    method: 'post',
    data
  })
}

export function editLoadPoolList(id, data) {
  return request({
    url: '/cainiao/edit_load_balance_pool/' + id,
    method: 'put',
    data
  })
}

export function deleteLoadPoolList(data) {
  return request({
    url: '/cainiao/delete_load_balance_pool',
    method: 'delete',
    data
  })
}
