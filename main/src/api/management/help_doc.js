import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/help_doc/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/cmdb/help_doc/',
    method: 'post',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/cmdb/help_doc/' + row_id + '/',
    method: 'delete'
  })
}

export function editRow(row_id, data) {
  return request({
    url: '/cmdb/help_doc/' + row_id + '/',
    method: 'put',
    data
  })
}

export function getBoardNames() {
  return request({
    url: '/cmdb/get_helpdoc_board/',
    method: 'get'
  })
}

export function getHelpDocContent(params) {
  return request({
    url: '/cmdb/get_helpdoc_content/',
    method: 'get',
    params: params
  })
}

// export function getHelpDocContent(board, title) {
//   return request({
//     url: '/cmdb/get_helpdoc_content/?board=' + board + '&title=' + title,
//     method: 'get'
//   })
// }
