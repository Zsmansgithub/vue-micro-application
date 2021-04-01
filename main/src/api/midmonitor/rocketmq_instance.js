import request from '@/utils/request2'

export function getRow(params) {
  return request({
    url: '/midmonitor/rocketmq_instance',
    method: 'get',
    params: params
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/midmonitor/rocketmq_instance_delete/' + row_id,
    method: 'delete'
  })
}

export function getMQClusterName() {
  return request({
    url: '/midmonitor/rocketmq_clustername',
    method: 'get'
  })
}
