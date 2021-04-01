import request from '@/utils/request2'

export function fetchList(query) {
  return request({
    url: '/cmdb/get_server_list',
    method: 'get',
    params: query
  })
}

export function fetchAppList(query) {
  return request({
    url: '/cmdb/get_app_list',
    method: 'get',
    params: query
  })
}

export function getScrapVM() {
  return request({
    url: '/cmdb/get_scrap_vm/',
    method: 'get'
  })
}

export function handleDeleteVM(data) {
  return request({
    url: '/cmdb/handle_delete_vm/',
    method: 'post',
    data
  })
}

export function exportList(params) {
  return request({
    url: '/cmdb/vm_export/',
    method: 'get',
    params: params
  })
}
