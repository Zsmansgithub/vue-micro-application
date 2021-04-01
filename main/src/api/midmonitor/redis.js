import request from '@/utils/request_response'

export function fetchList(query) {
  return request({
    url: '/midmonitor/redis/redis_instance_list',
    method: 'get',
    params: query
  })
}

export function deleteRow(id) {
  return request({
    url: '/midmonitor/redis/redis_instance_delete/' + id,
    method: 'delete'
  })
}

export function redisInstanceUpdate(id, data) {
  return request({
    url: '/midmonitor/redis/redis_instance_update/' + id + '/',
    method: 'put',
    data
  })
}

export function redisInstanceBulkUpdate(data) {
  return request({
    url: '/midmonitor/redis/redis_instance_bulkupdate/',
    method: 'put',
    data
  })
}

export function deleteClusterRow(id) {
  return request({
    url: '/midmonitor/redis/redis_cluster_delete/' + id,
    method: 'delete'
  })
}

export function deleteNullCluster() {
  return request({
    url: '/midmonitor/redis/delete_null_cluster/',
    method: 'get'
  })
}

export function BulkDeleteInstance(params) {
  return request({
    url: '/midmonitor/redis/bulk_delete_instance/',
    method: 'get',
    params: params
  })
}

export function fetchRedisInfo(query) {
  return request({
    url: '/midmonitor/redis/get_redis_info',
    method: 'get',
    params: query
  })
}

export function fetchRedisClient(query) {
  return request({
    url: '/midmonitor/redis/get_redis_client/',
    method: 'get',
    params: query
  })
}

export function fetchListCluster(query) {
  return request({
    url: '/midmonitor/redis/redis_cluster_list',
    method: 'get',
    params: query
  })
}

export function editCluster(row_id, data) {
  return request({
    url: '/midmonitor/redis/redis_cluster_edit/' + row_id,
    method: 'put',
    data
  })
}

export function getProjectName() {
  return request({
    url: '/midmonitor/redis/redis_project_name',
    method: 'get'
  })
}

export function getClusterUsername() {
  return request({
    url: '/midmonitor/redis/get_cluster_username/',
    method: 'get'
  })
}
