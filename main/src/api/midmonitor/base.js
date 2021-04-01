import request from '@/utils/request_response'

export function fetchClusterInfo(query) {
  return request({
    url: '/midmonitor/cluster_list_name',
    method: 'get',
    params: query
  })
}

export function fetchBorkerInfo(query) {
  return request({
    url: '/midmonitor/broker_info',
    method: 'get',
    params: query
  })
}

export function fetchTopicTable(query) {
  return request({
    url: '/midmonitor/topic_history_table',
    method: 'get',
    params: query
  })
}

export function fetchAppInfo(query) {
  return request({
    url: '/cmdb/get_app_by_id/' + query,
    method: 'get'
  })
}

export function fetchPoolInfo() {
  return request({
    url: '/cmdb/get_pool_list',
    method: 'get'
  })
}

export function fetchUserInfo(user) {
  return request({
    url: '/cmdb/get_user_list?user=' + user,
    method: 'get'

  })
}

export function fetchOpsUserInfo() {
  return request({
    url: '/cmdb/get_user_list',
    method: 'get'
  })
}

export function updateApp(id, data) {
  return request({
    url: '/cmdb/update_app/' + id,
    method: 'put',
    data
  })
}

export function createApp(data) {
  return request({
    url: '/cmdb/create_app',
    method: 'post',
    data
  })
}

export function createRList(data) {
  return request({
    url: '/cmdb/bulk_create_app',
    method: 'post',
    data
  })
}

export function fetchProjectId() {
  return request({
    url: '/cmdb/get_project_id_list',
    method: 'get'
  })
}

export function fetchConsumeTable(query) {
  return request({
    url: '/midmonitor/consume_history_table',
    method: 'get',
    params: query
  })
}

export function getTopicName() {
  return request({
    url: '/midmonitor/topic_name',
    method: 'get'
  })
}

export function fetchRocketList() {
  return request({
    url: '/midmonitor/rocketmq_list',
    method: 'get'
  })
}

export function editTopicConf(id,data) {
  return request({
    url: '/midmonitor/edit_topic_conf/'+id,
    method: 'put',
    data
  })
}

export function editConsumerConf(id,data) {
  return request({
    url: '/midmonitor/edit_consumer_conf/'+id,
    method: 'put',
    data
  })
}

export function editConsumerTopic(id,data) {
  return request({
    url: '/midmonitor/edit_consumer_topic_status/'+id,
    method: 'put',
    data
  })
}

export function getConsumerName() {
  return request({
    url: '/midmonitor/consumer_name',
    method: 'get'
  })
}
