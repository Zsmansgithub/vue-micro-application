import request from '@/utils/request_response'

export function fetchList(query) {
  return request({
    url: '/tools/get_machine_list',
    method: 'get',
    params: query
  })
}

export function addMachine(query) {
  return request({
    url: '/tools/add_machine_list',
    method: 'post',
    data: query
  })
}

export function editMachine(id, query) {
  return request({
    url: '/tools/edit_machine_list/' + id,
    method: 'put',
    data: query
  })
}

export function deleteMachine(id) {
  return request({
    url: '/tools/delete_machine_list/' + id,
    method: 'delete'
  })
}

export function getPhyResourceConf() {
  return request({
    url: '/workflow/get_resource_compute_conf',
    method: 'get'
  })
}
