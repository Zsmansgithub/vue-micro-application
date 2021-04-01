import request from '@/utils/request2'

export function getMalSubdivisionList(listQuery) {
  return request({
    url: '/workflow/mal_subdivision_list',
    method: 'get',
    params: listQuery
  })
}

export function createNewMalSubdivision(post_data) {
  return request({
    url: '/workflow/mal_subdivision_create',
    method: 'post',
    data: post_data
  })
}

export function editMalSubdivision(put_data, pk) {
  return request({
    url: '/workflow/mal_subdivision_update/' + pk,
    method: 'put',
    data: put_data
  })
}

export function deleteMalSubdivision(pk) {
  return request({
    url: '/workflow/mal_subdivision_delete/' + pk,
    method: 'delete'
  })
}

export function bacthUpdateMalSubdivision(data) {
  return request({
    url: '/workflow/mal_subdivision_batch_update',
    method: 'put',
    data
  })
}

export function getFirstLevelDict() {
  return request({
    url: '/workflow/malfunction_get_first_level_dict',
    method: 'get'
  })
}
