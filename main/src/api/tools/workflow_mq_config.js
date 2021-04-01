import request from '@/utils/request_response'

export function fetchList(query) {
  return request({
    url: '/tools/get_mq_config_list',
    method: 'get',
    params: query
  })
}

export function addList(query) {
  return request({
    url: '/tools/add_mq_config_list',
    method: 'post',
    data: query
  })
}

export function editList(id, query) {
  return request({
    url: '/tools/edit_mq_config_list/' + id,
    method: 'put',
    data: query
  })
}

export function deleteList(id) {
  return request({
    url: '/tools/delete_mq_config_list/' + id,
    method: 'delete'
  })
}

export function getMqType() {
  return request({
    url: '/tools/get_config_type',
    method: 'get'
  })
}

export function confirmUpdate(query) {
  return request({
    url: '/tools/mq_config_confirm_update',
    method: 'get',
    params:query,
  })
}

export function beforeUpdate(query) {
  return request({
    url: '/tools/mq_config_before_update',
    method: 'get',
    params:query,
  })
}
