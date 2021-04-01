import request from '@/utils/request2'

export function createAppPermission(data) {
  return request({
    url: '/cmdb/get_u_list',
    method: 'post',
    data
  })
}

export function getAppPermission(query) {
  return request({
    url: '/cmdb/get_u_list',
    method: 'get',
    params: query
  })
}

export function getProjectTreeList(query) {
  return request({
    url: '/cmdb/get_project_tree_list',
    method: 'get',
    params: query
  })
}

export function deleteAppp(row_id) {
  return request({
    url: '/cmdb/delete_appp/' + row_id,
    method: 'delete'
  })
}
