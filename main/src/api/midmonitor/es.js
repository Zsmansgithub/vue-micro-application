import request from '@/utils/request_response'

export function fetchList(query) {
  return request({
    url: '/midmonitor/es/es_instance_list',
    method: 'get',
    params: query
  })
}

export function getESClusterName() {
  return request({
    url: '/midmonitor/es/es_cluster_name',
    method: 'get'
  })
}

export function deleteEsNode(id) {
  return request({
    url: '/midmonitor/es/delete_es_instance_list/'+id,
    method: 'delete'
  })
}
