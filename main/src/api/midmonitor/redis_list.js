import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/midmonitor/redis/redis_list/',
    method: 'get',
    params: query
  })
}

// export function addRow(data) {
//   return request({
//     url: '/midmonitor/redis/redislist/',
//     method: 'post',
//     data
//   })
// }

export function addRow(data) {
  return request({
    url: '/midmonitor/redis/redis_list/',
    method: 'post',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/midmonitor/redis/redis_list/' + row_id + '/',
    method: 'delete'
  })
}

export function editRow(row_id, data) {
  return request({
    url: '/midmonitor/redis/redis_list/' + row_id + '/',
    method: 'put',
    data
  })
}

export function getSMSList() {
  return request({
    url: '/midmonitor/redis/sms_list/',
    method: 'get'
  })
}

export function handleLength(id) {
  return request({
    url: '/midmonitor/redis/handle_length/?id=' + id,
    method: 'get'
  })
}

export function getInstanceList() {
  return request({
    url: '/midmonitor/redis/instance_list/',
    method: 'get'
  })
}

export function getClusterList() {
  return request({
    url: '/midmonitor/redis/cluster_list/',
    method: 'get'
  })
}
