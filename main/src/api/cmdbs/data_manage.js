import request from '@/utils/request2'

export function fetchAllData(data) {
  return request({
    url: '/cmdb/fetch_all_datas',
    method: 'get',
    params: data
  })
}

export function addDatas(data) {
  return request({
    url: '/cmdb/add_in_out',
    method: 'post',
    data
  })
}

export function editDatas(id, data) {
  return request({
    url: '/cmdb/edit_in_out/' + id,
    method: 'put',
    data
  })
}

export function deleteDatas(id) {
  return request({
    url: '/cmdb/delete_in_out/' + id,
    method: 'delete'
  })
}

export function getLine() {
  return request({
    url: '/cmdb/get_yto_line',
    method: 'get'
  })
}

export function getWorkflow(query) {
  return request({
    url: '/cmdb/get_data_workflow',
    method: 'get',
    params: query
  })
}
