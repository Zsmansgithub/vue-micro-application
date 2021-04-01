import request from '@/utils/request2'

export function getlist(query) {
  return request({
    url: '/itsm/itsm_curd/',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/itsm/itsm_curd/',
    method: 'post',
    data
  })
}

export function doEdit(data) {
  return request({
    url: `/itsm/itsm_curd/${data.id}`,
    method: 'put',
    data
  })
}

export function doDelete(query) {
  return request({
    url: `/itsm/itsm_curd/${query.id}`,
    method: 'delete',
  })
}

export function change_extra_title(data) {
  return request({
    url: `/itsm/change_extra_title/`,
    method: 'post',
    data
  })
}

export function get_extra_title() {
  return request({
    url: `/itsm/change_extra_title`,
    method: 'get'
  })
}

//
export function getRow(query) {
  return request({
    url: `/itsm/get_project_config`,
    method: 'get',
    params: query
  })
}

// 导入文件
export function importExcel(data, headers) {
  return request({
    url: `/itsm/input_excel_data`,
    method: 'post',
    headers,
    data
  })
}

// 导出文件
export function exportExcel(data) {
  return request({
    url: `/itsm/export_excel_data`,
    responseType: 'blob',
    method: 'post',
    data
  })
}

// 批量删除
export function doBatchDeletion(data) {
  return request({
    url: `itsm/itsm_dispatch_delete`,
    method: 'post',
    data
  })
}

