import request from '@/utils/request2'

export function getBasicData(listQuery) {
  return request({
    url: '/workflow/mal_statistics_get_basic_data',
    method: 'get',
    params: listQuery
  })
}

export function getMaintenancePieData(listQuery) {
  return request({
    url: '/workflow/mal_statistics_get_maintenance_pie_data',
    method: 'get',
    params: listQuery
  })
}

export function getBrandPieData(listQuery) {
  return request({
    url: '/workflow/mal_statistics_get_brand_pie_data',
    method: 'get',
    params: listQuery
  })
}

export function getStackLineData(listQuery) {
  return request({
    url: '/workflow/mal_statistics_get_stack_line_data',
    method: 'get',
    params: listQuery
  })
}

export function getSubdivisionDetail(listQuery) {
  return request({
    url: '/workflow/mal_statistics_get_subdivision_detail',
    method: 'get',
    params: listQuery
  })
}

export function getProjectDetail(listQuery) {
  return request({
    url: '/workflow/mal_statistics_get_project_detail',
    method: 'get',
    params: listQuery
  })
}

export function getTableDataDivideByProject(listQuery) {
  return request({
    url: '/workflow/mal_statistics_get_table_data_divide_by_project',
    method: 'get',
    params: listQuery
  })
}
