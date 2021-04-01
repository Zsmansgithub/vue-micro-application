import request from '@/utils/request2'

export function getlist(query) {
  return request({
    url: '/itsm/get_change_operate',
    method: 'get',
    params: query
  })
}

export function addChangeOperate(data) {
  return request({
    url: '/itsm/add_change_operate',
    method: 'post',
    data
  })
}

export function editChangeOperate(data) {
  return request({
    url: `/itsm/edit_change_operate/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteChangeOperate(id) {
  return request({
    url: `/itsm/delete_change_operate/`+id,
    method: 'delete',
  })
}
