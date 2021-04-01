import request from '@/utils/request2'

export function fetchProcess(query) {
  return request({
    url: '/user/process_list',
    method: 'get',
    params: query
  })
}

export function editProcess(id, data) {
  return request({
    url: '/user/process_edit/' + id,
    method: 'put',
    data
  })
}

export function deleteProcess(id) {
  return request({
    url: '/user/process_delete/' + id,
    method: 'delete'
  })
}

export function startProcess(data) {
  return request({
    url: '/user/process_start',
    method: 'get',
    params: data
  })
}
