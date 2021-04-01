import request from '@/utils/request2'

export function validateCreateRedisPy(params) {
  return request({
    url: '/midmonitor/redis/add_validation/',
    method: 'get',
    params: params
  })
}

export function addRow(data) {
  return request({
    url: '/midmonitor/redis/redis_py/',
    method: 'post',
    data
  })
}

export function getRow(query) {
  return request({
    url: '/midmonitor/redis/redis_py/',
    method: 'get',
    params: query
  })
}

export function editRow(id, data) {
  return request({
    url: '/midmonitor/redis/redis_py/' + id + '/',
    method: 'patch',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/midmonitor/redis/redis_py/' + row_id + '/',
    method: 'delete'
  })
}

export function bulkUpdateRow(data) {
  return request({
    url: '/midmonitor/redis/bulk_update_redis_py/',
    method: 'put',
    data
  })
}

export function executeSync(params) {
  return request({
    url: '/midmonitor/redis/execute_sync/',
    method: 'get',
    params: params
  })
}
