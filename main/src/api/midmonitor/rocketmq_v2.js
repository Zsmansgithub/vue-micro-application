import request from '@/utils/request_response'

export function fetchClusterInfo(query) {
  return request({
    url: '/midmonitor/cluster_list_name_v2',
    method: 'get',
    params: query
  })
}

export function fetchBorkerInfo(query) {
  return request({
    url: '/midmonitor/broker_info2',
    method: 'get',
    params: query
  })
}

export function fetchTopicTable(query) {
  return request({
    url: '/midmonitor/topic_history_table2',
    method: 'get',
    params: query
  })
}

export function fetchConsumeTable(query) {
  return request({
    url: '/midmonitor/consume_history_table2',
    method: 'get',
    params: query
  })
}

export function getTopicName() {
  return request({
    url: '/midmonitor/topic_name2',
    method: 'get'
  })
}

// 此接口用于dashboard
export function fetchRocketList() {
  return request({
    url: '/midmonitor/rocketmq_list2',
    method: 'get'
  })
}

export function editTopicConf(id,data) {
  return request({
    url: '/midmonitor/edit_topic_conf2/'+id,
    method: 'put',
    data
  })
}

export function editConsumerConf(id,data) {
  return request({
    url: '/midmonitor/edit_consumer_conf2/'+id,
    method: 'put',
    data
  })
}

export function editConsumerTopic(id,data) {
  return request({
    url: '/midmonitor/edit_consumer_topic_status2/'+id,
    method: 'put',
    data
  })
}

export function getConsumerName() {
  return request({
    url: '/midmonitor/consumer_name2',
    method: 'get'
  })
}
