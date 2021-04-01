import request from '@/utils/request2'

export function getMalfunctionList(listQuery) {
  return request({
    url: '/workflow/malfunction_list',
    method: 'get',
    params: listQuery
  })
}

export function getDbManger(data) {
  return request({
    url: '/workflow/malfunction_get_ip_manager',
    method: 'get',
    params: data
  })
}

export function getProjectDetail(project_id) {
  return request({
    url: '/workflow/malfunction_get_project_detail/' + project_id,
    method: 'get'
  })
}

export function getProjectList() {
  return request({
    url: '/workflow/malfunction_get_project_list',
    method: 'get'
  })
}

export function getNewestMalId(category) {
  return request({
    url: '/workflow/malfunction_get_newest_mal_id/' + category,
    method: 'get'
  })
}

export function createNewMalfunction(post_data) {
  return request({
    url: '/workflow/malfunction_create',
    method: 'post',
    data: post_data
  })
}

export function editMalfunction(put_data, pk) {
  return request({
    url: '/workflow/malfunction_update/' + pk,
    method: 'put',
    data: put_data
  })
}

export function deleteMalfunction(pk) {
  return request({
    url: '/workflow/malfunction_delete/' + pk,
    method: 'delete'
  })
}

export function getEquipDetail(equipment_ip) {
  return request({
    url: '/workflow/malfunction_get_equip_detail',
    method: 'get',
    params: equipment_ip
  })
}

export function getFileList(malfunction_id) {
  return request({
    url: '/workflow/malfunction_get_file_list',
    method: 'get',
    params: malfunction_id
  })
}

export function removeFile(data) {
  return request({
    url: '/workflow/malfunction_remove_file',
    method: 'get',
    params: data
  })
}

export function getHandleProcess(pk) {
  return request({
    url: '/workflow/malfunction_get_handle_process/' + pk,
    method: 'get'
  })
}

export function getDeviceInfo(pk) {
  return request({
    url: '/workflow/malfunction_get_device_info/' + pk,
    method: 'get'
  })
}

export function getScoreInfo(pk) {
  return request({
    url: '/workflow/malfunction_get_score_info/' + pk,
    method: 'get'
  })
}

export function getSubdivisionList() {
  return request({
    url: '/workflow/malfunction_get_subdivision_list',
    method: 'get'
  })
}

export function getAppNameCascade() {
  return request({
    url: '/workflow/malfunction_get_app_name_cascade',
    method: 'get'
  })
}

export function getLevelCascade() {
  return request({
    url: '/workflow/malfunction_get_level_cascade',
    method: 'get'
  })
}

export function getUserList() {
  return request({
    url: '/workflow/malfunction_get_user_list',
    method: 'get'
  })
}

export function getMaintenanceList() {
  return request({
    url: '/workflow/malfunction_get_maintenance_list',
    method: 'get'
  })
}

export function getHandlerList() {
  return request({
    url: '/workflow/malfunction_get_handler_list',
    method: 'get'
  })
}

export function getUserDepartment() {
  return request({
    url: '/workflow/malfunction_get_user_department',
    method: 'get'
  })
}
