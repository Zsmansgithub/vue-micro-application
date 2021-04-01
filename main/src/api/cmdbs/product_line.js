import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/product_line/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/cmdb/product_line/',
    method: 'post',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/cmdb/product_line/' + row_id + '/',
    method: 'delete'
  })
}

export function editRow(row_id, data) {
  return request({
    url: '/cmdb/product_line/' + row_id + '/',
    method: 'put',
    data
  })
}

export function getFields() {
  return request({
    url: '/cmdb/get_fields_list/',
    method: 'get'
  })
}

export function getFieldsAlias() {
  return request({
    url: '/cmdb/get_fields_alias/',
    method: 'get'
  })
}

export function getProductCascader() {
  return request({
    url: '/cmdb/get_product_cascader/',
    method: 'get'
  })
}

export function getProductCascader2() {
  return request({
    url: '/cmdb/get_product_cascader2/',
    method: 'get'
  })
}

export function getProductAppCascader() {
  return request({
    url: '/cmdb/get_product_app_cascader/',
    method: 'get'
  })
}

export function getProductAppCascaderNginx() {
  return request({
    url: '/cmdb/get_product_app_cascader_nginx/',
    method: 'get'
  })
}

export function fetchProjectId() {
  return request({
    url: '/cmdb/get_project_id_list/',
    method: 'get'
  })
}

export function getProjectname(row_id) {
  return request({
    url: '/cmdb/get_project_by_id/' + row_id,
    method: 'get'
  })
}

export function getProjectGitaddr(row_id) {
  return request({
    url: '/cmdb/get_gitaddr_by_projectid/' + row_id,
    method: 'get'
  })
}

export function bulkUpdateProduct(data) {
  return request({
    url: '/cmdb/bulk_update_product/',
    method: 'put',
    data
  })
}

export function addProjectUnit(data) {
  return request({
    url: '/cmdb/add_project_unit/',
    method: 'post',
    data
  })
}

export function editProjectUnit(data) {
  return request({
    url: '/cmdb/edit_project_unit/',
    method: 'post',
    data
  })
}
