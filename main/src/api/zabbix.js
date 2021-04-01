import request from '@/utils/request2'

export function fetchList(query) {
  return request({
    url: '/zabbix/get_alarm_list',
    method: 'get',
    params: query
  })
}

export function fetchServerList(query) {
  return request({
    url: '/zabbix/get_server_list',
    method: 'get',
    params: query
  })
}

export function zabbixListMysqlGetList(query) {
  return request({
    url: '/zabbix/zabbix_list_mysql_get_list',
    method: 'get',
    params: query
  })
}

export function zabbixListOracleGetList(query) {
  return request({
    url: '/zabbix/zabbix_list_oracle_get_list',
    method: 'get',
    params: query
  })
}

export function fetchServerListAllIp(query) {
  return request({
    url: '/zabbix/get_server_list_all_ip',
    method: 'get',
    params: query
  })
}

export function fetchServerListAll(query) {
  return request({
    url: '/zabbix/get_server_list_all',
    method: 'get',
    params: query
  })
}

export function getZabbixHistoryData(query) {
  return request({
    url: '/zabbix/get_zabbix_history_data',
    method: 'get',
    params: query
  })
}

export function hostsViewsEnableZabbixMonitor(query) {
  return request({
    url: '/zabbix/hosts_views_enable_zabbix_monitor',
    method: 'get',
    params: query
  })
}

export function alarmMsgLog(query) {
  return request({
    url: '/zabbix/alarm_msg_log',
    method: 'get',
    params: query
  })
}

export function update(row_id, data) {
  data['is_ack'] = 1
  return request({
    url: '/zabbix/update_alarm_comm/' + row_id,
    method: 'put',
    data
  })
}

export function uacBatchAck(query) {
  return request({
    url: '/zabbix/update_alarm_comm_batch_ack',
    method: 'get',
    params: query
  })
}

export function fetchAlarmHistoryList(query) {
  return request({
    url: '/zabbix/get_alarm_history_list',
    method: 'get',
    params: query
  })
}

export function alarmSmsLogUsers(query) {
  return request({
    url: '/zabbix/alarm_msg_log_user_info',
    method: 'get',
    params: query
  })
}

export function alarmSmsLogGetTop10Data(query) {
  return request({
    url: '/zabbix/alarm_msg_log_get_top_10_data',
    method: 'get',
    params: query
  })
}


// mysql/oracle
export function getmysqloracle() {
  return request({
    url: `/zabbix/db_cluster_get_workflow_db_list`,
    method: 'get'
  })
}

// mongodb
export function getmongodb() {
  return request({
    url: `/zabbix/db_cluster_mongo_db_for_internal_firewall`,
    method: 'get'
  })
}


// redis
export function getredis() {
  return request({
    url: `/midmonitor/redis/get_cascader_menu`,
    method: 'get'
  })
}

// windows list
export function getwindowslist() {
  return request({
    url: `/zabbix/db_cluster_get_windows_ip_list`,
    method: 'get'
  })
}

export function getLastChannelId() {
  return request({
    url: `/zabbix/db_cluster_get_last_channel_id`,
    method: 'get'
  })
}
