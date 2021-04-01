import request from '@/utils/request2'

export function getCatUrlRow(query) {
  return request({
    url: '/zabbix/cat_url_monitor/',
    method: 'get',
    params: query
  })
}

export function getServerUrl() {
  return request({
    url: '/zabbix/get_cat_server/',
    method: 'get'
  })
}

export function getHeartBeat(app_name, ip) {
  return request({
    url: '/zabbix/get_cat_heart/' + app_name + '/' + ip,
    method: 'get',
    params: { 'app_name': app_name, 'ip': ip }
  })
}

export function getJvmMonitor(query) {
  return request({
    url: '/zabbix/jvm_monitor/',
    method: 'get',
    params: query
  })
}

export function getServerIp() {
  return request({
    url: '/zabbix/get_server_ip/',
    method: 'get'
  })
}
