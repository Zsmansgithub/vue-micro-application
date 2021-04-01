import request from '@/utils/request2'

export function getClusters(query) {
  return request({
    url: '/midmonitor/cluster_list',
    method: 'get',
    params: query
  })
}

export function addCluster(data) {
  return request({
    url: '/midmonitor/create_cluster',
    method: 'post',
    data
  })
}

export function deleteCluster(row_id) {
  return request({
    url: '/midmonitor/delete_cluster/' + row_id,
    method: 'delete'
  })
}

export function editCluster(row_id, data) {
  return request({
    url: '/midmonitor/edit_cluster/' + row_id,
    method: 'put',
    data
  })
}

export function getClustersName() {
  return request({
    url: '/midmonitor/cluster_name',
    method: 'get'
  })
}

export function handleURL(id) {
  return request({
    url: '/midmonitor/handle_url/?id=' + id,
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/midmonitor/get_user_info/',
    method: 'get'
  })
}

export function getClustersMq(query) {
  return request({
    url: '/midmonitor/cluster_list_v2',
    method: 'get',
    params: query
  })
}

export function addClusterMq(data) {
  return request({
    url: '/midmonitor/create_cluster_v2',
    method: 'post',
    data
  })
}

export function deleteClusterMq(row_id) {
  return request({
    url: '/midmonitor/delete_cluster_v2/' + row_id,
    method: 'delete'
  })
}

export function editClusterMq(row_id, data) {
  return request({
    url: '/midmonitor/edit_cluster_v2/' + row_id,
    method: 'put',
    data
  })
}

export function getClustersNameMq() {
  return request({
    url: '/midmonitor/cluster_name_v2',
    method: 'get'
  })
}

export function handleURLMq(id) {
  return request({
    url: '/midmonitor/handle_url_v2/?id=' + id,
    method: 'get'
  })
}
