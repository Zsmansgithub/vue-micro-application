import request from '@/utils/request2'

export function fetchF5Server(query) {
  return request({
    url: '/cainiao/get_f5_server',
    method: 'get',
    params: query
  })
}

export function refreshF5Server(data) {
  return request({
    url: '/cainiao/refresh_f5_server',
    method: 'post',
    data
  })
}

export function statusF5Server(query) {
  return request({
    url: '/cainiao/enable_disable_server',
    method: 'post',
    data: query
  })
}

export function remarkF5Server(data) {
  return request({
    url: '/cainiao/remark_f5_server',
    method: 'post',
    data
  })
}

export function statusVs(data) {
  return request({
    url: '/cainiao/enable_disable_vs',
    method: 'post',
    data
  })
}

export function remarkVs(data) {
  return request({
    url: '/cainiao/remark_f5_vs',
    method: 'post',
    data
  })
}

export function fetchF5Pool(data) {
  return request({
    url: '/cainiao/get_f5_pool',
    method: 'get',
    params: data
  })
}

export function refreshF5Pool(data) {
  return request({
    url: '/cainiao/refresh_f5_pool',
    method: 'post',
    data
  })
}

export function statusF5Pool(query) {
  return request({
    url: '/cainiao/status_f5_pool',
    method: 'post',
    data: query
  })
}

export function remarkF5Pool(query) {
  return request({
    url: '/cainiao/remark_f5_pool',
    method: 'post',
    data: query
  })
}

export function statusF5Member(query) {
  return request({
    url: '/cainiao/status_f5_member',
    method: 'post',
    data: query
  })
}

export function remarkF5Member(query) {
  return request({
    url: '/cainiao/remark_f5_member',
    method: 'post',
    data: query
  })
}

export function fetchF5WideIp(query) {
  return request({
    url: '/cainiao/fetch_wide_ip',
    method: 'get',
    params: query
  })
}

export function insertF5WideIp(query) {
  return request({
    url: '/cainiao/insert_wide_ip',
    method: 'post',
    data: query
  })
}

export function importF5WideIp(query) {
  return request({
    url: '/cainiao/import_wide_ip',
    method: 'post',
    data: query
  })
}

export function refreshF5WideIp(query) {
  return request({
    url: '/cainiao/refresh_wide_ip',
    method: 'post',
    data: query
  })
}

export function deleteF5WideIp(query) {
  return request({
    url: '/cainiao/delete_wide_ip',
    method: 'post',
    data: query
  })
}

export function statusF5WideIp(query) {
  return request({
    url: '/cainiao/status_wide_ip',
    method: 'post',
    data: query
  })
}

export function remarkF5WideIp(query) {
  return request({
    url: '/cainiao/remark_wide_ip',
    method: 'post',
    data: query
  })
}

export function getDatacenter() {
  return request({
    url: '/cainiao/get_datacenter',
    method: 'get'
  })
}

export function getPartition() {
  return request({
    url: '/cainiao/get_partition',
    method: 'get'
  })
}

export function getzonelist() {
  return request({
    url: '/cainiao/get_zonelist',
    method: 'get'
  })
}

export function aliaeseF5WideIp(data) {
  return request({
    url: '/cainiao/aliaese_wide_ip',
    method: 'post',
    data
  })
}

export function getUsers() {
  return request({
    url: '/cainiao/get_login_user',
    method: 'get'
  })
}

export function addF5Server(query) {
  return request({
    url: '/cainiao/add_f5_server',
    method: 'post',
    data: query
  })
}

export function deleteF5Server(query) {
  return request({
    url: '/cainiao/delete_f5_server',
    method: 'post',
    data: query
  })
}

export function addF5Vs(query) {
  return request({
    url: '/cainiao/add_f5_vs',
    method: 'post',
    data: query
  })
}

export function deleteF5Vs(query) {
  return request({
    url: '/cainiao/delete_f5_vs',
    method: 'post',
    data: query
  })
}

export function getPoolType() {
  return request({
    url: '/cainiao/get_pool_type',
    method: 'get'
  })
}

export function getVs() {
  return request({
    url: '/cainiao/get_members_list',
    method: 'get'
  })
}

export function getWide() {
  return request({
    url: '/cainiao/get_wide_info',
    method: 'get'
  })
}

export function getPool() {
  return request({
    url: '/cainiao/get_pool_info',
    method: 'get'
  })
}

export function addF5Pool(query) {
  return request({
    url: '/cainiao/add_f5_pool',
    method: 'post',
    data: query
  })
}

export function updateF5Pool(query) {
  return request({
    url: '/cainiao/update_f5_pool',
    method: 'post',
    data: query
  })
}

export function deleteF5Pool(query) {
  return request({
    url: '/cainiao/delete_f5_pool',
    method: 'post',
    data: query
  })
}

export function addF5Wide(query) {
  return request({
    url: '/cainiao/add_f5_wide',
    method: 'post',
    data: query
  })
}

export function editF5Wide(query) {
  return request({
    url: '/cainiao/edit_f5_wide',
    method: 'post',
    data: query
  })
}

export function deleteF5Wide(query) {
  return request({
    url: '/cainiao/delete_f5_wide',
    method: 'post',
    data: query
  })
}

export function getMonitors() {
  return request({
    url: '/cainiao/get_monitors',
    method: 'get'
  })
}

export function getFailLog(query) {
  return request({
    url: '/cainiao/get_fail_log',
    method: 'get',
    params: query
  })
}

export function getDnsDevice(query) {
  return request({
    url: '/cainiao/get_f5_dns_device',
    method: 'get',
    params: query
  })
}

export function getDnsDeviceGroup(query) {
  return request({
    url: '/cainiao/get_f5_dns_device_group',
    method: 'get',
    params: query
  })
}

export function getDnsInterface(query) {
  return request({
    url: '/cainiao/get_dns_interface',
    method: 'get',
    params: query
  })
}

export function getWideIpMonitor(query) {
  return request({
    url: '/cainiao/get_f5_monitor',
    method: 'get',
    params: query
  })
}
