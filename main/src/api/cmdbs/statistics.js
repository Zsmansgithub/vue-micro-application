import request from '@/utils/request2'

export function getSummary() {
  return request({
    url: '/cmdb/statistics/get_summary/',
    method: 'get'
  })
}

// 产品线
export function getProjectUnit() {
  return request({
    url: '/cmdb/statistics/get_project_unit/',
    method: 'get'
  })
}

export function getProjectTree(params) {
  return request({
    url: '/cmdb/statistics/get_project_tree/',
    method: 'get',
    params: params
  })
}

export function getProjectFirstList(params) {
  return request({
    url: '/cmdb/statistics/get_project_first_list/',
    method: 'get',
    params: params
  })
}

export function getProjectSecondList(params) {
  return request({
    url: '/cmdb/statistics/get_project_second_list/',
    method: 'get',
    params: params
  })
}

export function getProjectThirdList(params) {
  return request({
    url: '/cmdb/statistics/get_project_third_list/',
    method: 'get',
    params: params
  })
}

// 负责人
export function getOwnerFirstList() {
  return request({
    url: '/cmdb/statistics/get_owner_first_table/',
    method: 'get'
  })
}

export function getOwnerSecondList(params) {
  return request({
    url: '/cmdb/statistics/get_owner_second_table/',
    method: 'get',
    params: params
  })
}

// vcenter
export function getVcenterFirstList(params) {
  return request({
    url: '/cmdb/statistics/get_vcenter_first_table/',
    method: 'get',
    params: params
  })
}

export function getVcenterSelect() {
  return request({
    url: '/cmdb/statistics/get_vcenter_select/',
    method: 'get'
  })
}

export function getVcenterSecondList(params) {
  return request({
    url: '/cmdb/statistics/get_vcenter_second_table/',
    method: 'get',
    params: params
  })
}

export function getVcenterVirApp(params) {
  return request({
    url: '/cmdb/statistics/get_vcenter_vir_app/',
    method: 'get',
    params: params
  })
}

export function getVcenterClusterDic() {
  return request({
    url: '/cmdb/statistics/get_vcenter_cluster_dic/',
    method: 'get'
  })
}

// 机房
export function getMRFirstList() {
  return request({
    url: '/cmdb/statistics/get_mr_first_table/',
    method: 'get'
  })
}

export function getMRNames() {
  return request({
    url: '/cmdb/statistics/get_mr_names/',
    method: 'get'
  })
}

export function getMRSecondList(params) {
  return request({
    url: '/cmdb/statistics/get_mr_second_table/',
    method: 'get',
    params: params
  })
}

// 维保商
export function getSupplierFirstTable(params) {
  return request({
    url: '/cmdb/statistics/get_supplier_first_table/',
    method: 'get',
    params: params
  })
}

export function getSupplierTypes() {
  return request({
    url: '/cmdb/statistics/get_supplier_types/',
    method: 'get'
  })
}

export function getSupplierSecondTable(params) {
  return request({
    url: '/cmdb/statistics/get_supplier_second_table/',
    method: 'get',
    params: params
  })
}

// 品牌
export function getBrandFirstTable() {
  return request({
    url: '/cmdb/statistics/get_brand_first_table/',
    method: 'get'
  })
}

export function getBrandNames() {
  return request({
    url: '/cmdb/statistics/get_brand_names/',
    method: 'get'
  })
}

export function getBrandSecondTable(params) {
  return request({
    url: '/cmdb/statistics/get_brand_second_table/',
    method: 'get',
    params: params
  })
}

// OS
export function getOSFirstTable() {
  return request({
    url: '/cmdb/statistics/get_os_first_table/',
    method: 'get'
  })
}

export function getOSNames() {
  return request({
    url: '/cmdb/statistics/get_os_names/',
    method: 'get'
  })
}

export function getOSSecondTable(params) {
  return request({
    url: '/cmdb/statistics/get_os_second_table/',
    method: 'get',
    params: params
  })
}
