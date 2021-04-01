import request from '@/utils/request2'

export function fetchNetWhite(query) {
  return request({
    url: '/cainiao/get_net_white_list',
    method: 'get',
    params: query
  })
}

export function addNetWhite(data) {
  return request({
    url: '/cainiao/add_net_white_list',
    method: 'post',
    data
  })
}

export function editNetWhite(id, data) {
  return request({
    url: '/cainiao/edit_net_white_list/' + id,
    method: 'put',
    data
  })
}

export function deleteNetWhite(id) {
  return request({
    url: '/cainiao/delete_net_white_list/' + id,
    method: 'delete'
  })
}

