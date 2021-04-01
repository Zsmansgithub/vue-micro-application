import request from '@/utils/request2'

export function fetchLtmDevice(query) {
  return request({
    url: '/cainiao/get_ltm_device',
    method: 'get',
    params: query
  })
}

export function getLtmDeviceGroup(data) {
  return request({
    url: '/cainiao/get_device_group',
    method: 'get',
    params: data
  })
}

export function getLtmRule(query) {
  return request({
    url: '/cainiao/get_ltm_rule',
    method: 'get',
    params: query
  })
}

export function getSnatpool(data) {
  return request({
    url: '/cainiao/get_ltm_snatpool',
    method: 'get',
    params: data
  })
}

export function getLtmIp() {
  return request({
    url: '/cainiao/get_ltm_ip',
    method: 'get'
  })
}

export function getLtmNode(data) {
  return request({
    url: '/cainiao/get_ltm_node',
    method: 'get',
    params: data
  })
}

export function refreshLtmNode(data) {
  return request({
    url: '/cainiao/refresh_ltm_node',
    method: 'post',
    data
  })
}

export function statusLtmNode(data) {
  return request({
    url: '/cainiao/status_ltm_node',
    method: 'post',
    data
  })
}

export function remarkLtmNode(query) {
  return request({
    url: '/cainiao/remark_ltm_node',
    method: 'post',
    data: query
  })
}

export function insertLtmNode(query) {
  return request({
    url: '/cainiao/insert_ltm_node',
    method: 'post',
    data: query
  })
}

export function mgIps() {
  return request({
    url: '/cainiao/get_ltm_mgips',
    method: 'get'
  })
}

export function ltmIpName() {
  return request({
    url: '/cainiao/get_ltm_ip_name',
    method: 'get'
  })
}

export function deleteLtmNode(query) {
  return request({
    url: '/cainiao/delete_ltm_node',
    method: 'post',
    data: query
  })
}

export function getLtmPool(query) {
  return request({
    url: '/cainiao/get_ltm_pool',
    method: 'get',
    params: query
  })
}

export function refreshLtmPool(query) {
  return request({
    url: '/cainiao/refresh_ltm_pool',
    method: 'post',
    data: query
  })
}

export function insertLtmPool(query) {
  return request({
    url: '/cainiao/insert_ltm_pool',
    method: 'post',
    data: query
  })
}

export function deleteLtmPool(query) {
  return request({
    url: '/cainiao/delete_ltm_pool',
    method: 'post',
    data: query
  })
}

export function remarkLtmPool(query) {
  return request({
    url: '/cainiao/remark_ltm_pool',
    method: 'post',
    data: query
  })
}

export function getLtmPartition() {
  return request({
    url: '/cainiao/get_name_ip_monitor',
    method: 'get'
  })
}

export function getLtmSlb() {
  return request({
    url: '/cainiao/get_ltm_slb',
    method: 'get'
  })
}

export function getLtmNewNode(query) {
  return request({
    url: '/cainiao/get_ltm_new_node',
    method: 'post',
    data: query
  })
}

export function getLtmNewNodeIp(query) {
  return request({
    url: '/cainiao/get_ltm_new_node_ip',
    method: 'post',
    data: query
  })
}

export function statusPoolMembers(data) {
  return request({
    url: '/cainiao/status_ltm_pool_member',
    method: 'post',
    data
  })
}

export function remarkPoolMembers(data) {
  return request({
    url: '/cainiao/remark_ltm_pool_member',
    method: 'post',
    data
  })
}

export function editLtmPool(data) {
  return request({
    url: '/cainiao/edit_ltm_pool',
    method: 'post',
    data
  })
}

export function insertPoolMember(query) {
  return request({
    url: '/cainiao/insert_ltm_pool_member',
    method: 'post',
    data: query
  })
}

export function editPoolMember(query) {
  return request({
    url: '/cainiao/edit_ltm_pool_member',
    method: 'post',
    data: query
  })
}

export function removePoolMember(query) {
  return request({
    url: '/cainiao/remove_ltm_pool_member',
    method: 'post',
    data: query
  })
}

export function getLtmFailLog(query) {
  return request({
    url: '/cainiao/ltm_fail_log',
    method: 'get',
    params: query
  })
}

export function getLineIpBind(query) {
  return request({
    url: '/cainiao/get_line_ip_bind',
    method: 'get',
    params: query
  })
}

export function addLineIpBind(data) {
  return request({
    url: '/cainiao/add_line_ip_bind',
    method: 'post',
    data
  })
}

export function editLineIpBind(id, data) {
  return request({
    url: '/cainiao/edit_line_ip_bind/' + id,
    method: 'put',
    data
  })
}

export function deleteLineIpBind(id) {
  return request({
    url: '/cainiao/delete_line_ip_bind/' + id,
    method: 'delete'
  })
}

export function getOutLine() {
  return request({
    url: '/cainiao/get_out_line',
    method: 'get'
  })
}

export function getLtmVs(query) {
  return request({
    url: '/cainiao/get_ltm_vs',
    method: 'get',
    params: query
  })
}

export function addLtmVs(query) {
  return request({
    url: '/cainiao/add_ltm_vs',
    method: 'post',
    data: query
  })
}

export function editLtmVs(query) {
  return request({
    url: '/cainiao/edit_ltm_vs',
    method: 'post',
    data: query
  })
}

export function deleteLtmVs(query) {
  return request({
    url: '/cainiao/delete_ltm_vs',
    method: 'post',
    data: query
  })
}

export function getNetInterface(query) {
  return request({
    url: '/cainiao/get_net_interface',
    method: 'get',
    params: query
  })
}

export function getProfileClient() {
  return request({
    url: '/cainiao/get_profile_client',
    method: 'get'
  })
}

export function getSnatName(query) {
  return request({
    url: '/cainiao/get_snat_pool_name',
    method: 'get',
    params: query
  })
}

export function getPoolName(query) {
  return request({
    url: '/cainiao/get_pool_name',
    method: 'get',
    params: query
  })
}

export function getRuleName(query) {
  return request({
    url: '/cainiao/get_rule_name',
    method: 'get',
    params: query
  })
}

export function refreshLtmVs(query) {
  return request({
    url: '/cainiao/refresh_ltm_vs',
    method: 'post',
    data: query
  })
}

export function statusLtmVs(query) {
  return request({
    url: '/cainiao/status_ltm_vs',
    method: 'post',
    data: query
  })
}

export function remarkLtmVs(query) {
  return request({
    url: '/cainiao/remark_ltm_vs',
    method: 'post',
    data: query
  })
}

export function monitorLtmVs(query) {
  return request({
    url: '/cainiao/ltm_vs_monitor',
    method: 'get',
    params: query
  })
}
