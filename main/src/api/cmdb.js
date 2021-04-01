import request from '@/utils/request2'
// IP管理
// 根据IP前三位查询所有IP分配状态
export function fetchIpManage(query) {
  return request({
    url: `/cmdb/ip_manage/?partial_ip=${query}`,
    method: 'get'
  })
}
// 分配IP
export function distributionIp(data) {
  return request({
    url: `/cmdb/ip_manage/`,
    method: 'post',
    data
  })
}
// 置空IP
export function blankingIp(id) {
  return request({
    url: `cmdb/ip_manage/${id}/`,
    method: 'delete'
  })
}

export function fetchList(query) {
  return request({
    url: '/cmdb/get_server_list',
    method: 'get',
    params: query
  })
}

export function fetchIPList(query) {
  return request({
    url: '/cmdb/get_resource_ip',
    method: 'get',
    params: query
  })
}

export function fetchIPList1() {
  return request({
    url: '/cmdb/get_security_ip/',
    method: 'get'
  })
}

export function getMachineRoom(query) {
  return request({
    url: '/cmdb/get_machine_room_list',
    method: 'get',
    params: query
  })
}

export function getMachineRoomNp(query) {
  return request({
    url: '/cmdb/get_machine_room_list_np',
    method: 'get',
    params: query
  })
}

export function getFrameAndRackDetails(query) {
  return request({
    url: '/cmdb/get_frame_and_rack_list',
    method: 'get',
    params: query
  })
}

export function eidtManchineRoom(row_id, data) {
  return request({
    url: 'cmdb/update_machineRoom/' + row_id,
    method: 'put',
    data
  })
}

export function eidtFrameAndRack(row_id, data) {
  return request({
    url: 'cmdb/update_frame_and_rack/' + row_id,
    method: 'put',
    data
  })
}

export function deleteMachineRoom(row_id) {
  return request({
    url: 'cmdb/delete_machineRoom/' + row_id,
    method: 'delete'
  })
}

export function deleteFrameAndRack(row_id) {
  return request({
    url: 'cmdb/delete_frame_and_rack/' + row_id,
    method: 'delete'
  })
}

export function fetchAppListP(query) {
  return request({
    url: '/cmdb/get_app_list_p',
    method: 'get',
    params: query
  })
}

export function fetchProjectList(query) {
  return request({
    url: '/cmdb/get_project_list',
    method: 'get'
  })
}

export function fetchOprLogList(query) {
  return request({
    url: '/cmdb/get_opr_log_list',
    method: 'get',
    params: query
  })
}

export function fetchPoolList(query) {
  return request({
    url: '/cmdb/get_pool_lists',
    method: 'get',
    params: query
  })
}

export function fetchProjectCList(query) {
  return request({
    url: '/cmdb/get_project_cascader_list',
    method: 'get',
    params: query
  })
}

export function fetchAppCascader() {
  return request({
    url: '/cmdb/get_app_cascader_ip',
    method: 'get'
  })
}

export function addPool(data) {
  return request({
    url: '/cmdb/add_pool_list',
    method: 'post',
    data
  })
}

export function addFrameAndRack(data) {
  return request({
    url: '/cmdb/add_frame_and_rack',
    method: 'post',
    data
  })
}

export function AddMachineRoom(data) {
  return request({
    url: 'cmdb/add_machine_room',
    method: 'post',
    data
  })
}

export function editPool(row_id, data) {
  return request({
    url: '/cmdb/update_pool_list/' + row_id,
    method: 'put',
    data
  })
}

export function deletePool(row_id) {
  return request({
    url: '/cmdb/delete_pool_list/' + row_id,
    method: 'delete'
  })
}

export function fetchNumberList(query) {
  return request({
    url: '/cmdb/get_number_list',
    method: 'get',
    params: query
  })
}

export function fetchNumberList2(query) {
  return request({
    url: '/cmdb/get_number_list2',
    method: 'get',
    params: query
  })
}

export function addNumber(data) {
  return request({
    url: '/cmdb/add_number_list',
    method: 'post',
    data
  })
}

export function editNumber(row_id, data) {
  return request({
    url: '/cmdb/update_number_list/' + row_id,
    method: 'put',
    data
  })
}

export function accountBacthUpdate(data) {
  return request({
    url: '/cmdb/account_batch_update',
    method: 'put',
    data
  })
}

export function deleteNumber(row_id) {
  return request({
    url: '/cmdb/delete_number_list/' + row_id,
    method: 'delete'
  })
}
export function accountPermissionDelete(row_id) {
  return request({
    url: '/cmdb/account_permission_delete/' + row_id,
    method: 'delete'
  })
}

export function accountBulkCreate(data) {
  return request({
    url: '/cmdb/account_bulk_create',
    method: 'post',
    data
  })
}

export function accountGetIpList() {
  return request({
    url: '/cmdb/account_get_ip_list',
    method: 'get'
  })
}

export function fetchUserList() {
  return request({
    url: '/cmdb/get_user_lists',
    method: 'get'
  })
}

export function getLoginUser() {
  return request({
    url: '/cmdb/get_login_user',
    method: 'get'
  })
}

export function fetchDbList(query) {
  return request({
    url: '/cmdb/get_db_list',
    method: 'get',
    params: query
  })
}

export function addDbManager(data) {
  return request({
    url: '/cmdb/add_db_list',
    method: 'post',
    data
  })
}

export function editDb(row_id, data) {
  return request({
    url: '/cmdb/edit_db_list/' + row_id,
    method: 'put',
    data
  })
}

export function deleteDb(row_id) {
  return request({
    url: '/cmdb/delete_db_list/' + row_id,
    method: 'delete'
  })
}

export function getIp() {
  return request({
    url: '/cmdb/get_ips_list',
    method: 'get'
  })
}

export function getUserConf() {
  return request({
    url: '/cmdb/get_user_conf',
    method: 'get'
  })
}

export function getAppList() {
  const appnameOptions = []
  fetchAppList().then(response => {
    for (const i of response) {
      appnameOptions.push({
        display_name: i.app_cname, key: i.id
      })
    }
  })
  return appnameOptions
}

export function AccGetUserList() {
  return request({
    url: '/cmdb/account_manage_get_user_list',
    method: 'get'
  })
}

export function AccAddGrandPermission(data) {
  return request({
    url: '/cmdb/account_manage_add_grant_permission',
    method: 'post',
    data
  })
}

export function AccGetGroupList() {
  return request({
    url: '/cmdb/account_manage_get_group_list',
    method: 'get'
  })
}

export function getPoolAll() {
  return request({
    url: '/cmdb/get_pool_all',
    method: 'get'
  })
}

export function getPoolAll1() {
  return request({
    url: '/cmdb/get_pool_all1/',
    method: 'get'
  })
}

export function getPoolProduct() {
  return request({
    url: '/cmdb/get_pool_product',
    method: 'get'
  })
}

export function getAppResource(query) {
  return request({
    url: '/cmdb/get_app_resource',
    method: 'get',
    params: query
  })
}

export function sumResource(query) {
  return request({
    url: '/cmdb/sum_app_resource',
    method: 'post',
    data: query
  })
}

export function importPool(query) {
  return request({
    url: '/cmdb/import_pool_resource',
    method: 'post',
    data: query
  })
}

export function poolValidation(params) {
  return request({
    url: '/cmdb/pool_validation/',
    method: 'get',
    params: params
  })
}

// uat列表 sit列表
export function getuatsitlist() {
  return request({
    url: `/cmdb/get_uatsit_ip_list`,
    method: 'get'
  })
}
// 机房视图
export function getMachine() {
  return request({
    // url: `/cmdb/statistics/get_mr_first_table`,
    url: `/cmdb/statistics/get_mr/`,
    // method: 'options'
    method: 'get'
  })
}
export function getPassageway(id) {
  return request({
    // url: `/cmdb/statistics/get_mr_second_table/?mr_name=` + id,
    url: `/cmdb/statistics/get_frame/?mr_id=` + id,
    // method: 'options'
    method: 'get'
  })
}
export function getCabinet(id) {
  return request({
    // url: `/cmdb/statistics/get_mr_second_table/?mr_name=` + id,
    url: `/cmdb/statistics/get_rack/?fr_id=` + id,
    // method: 'options'
    method: 'get'
  })
}
export function getErrorMsg(ip) {
  return request({
    url: `/zabbix/alarm_views_get_error_msg_list?ip=` + ip,
    method: 'get'
  })
}

export function fetchAppList(query) {
  return request({
    url: '/cmdb/get_app_list',
    method: 'get',
    params: query
  })
}
