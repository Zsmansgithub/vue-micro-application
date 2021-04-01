import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/cmdb/deploy_conf/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/cmdb/deploy_conf/',
    method: 'post',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/cmdb/deploy_conf/' + row_id + '/',
    method: 'delete'
  })
}

export function editRow(row_id, data) {
  return request({
    url: '/cmdb/deploy_conf/' + row_id + '/',
    method: 'put',
    data
  })
}

export function getAppLocal() {
  return request({
    url: '/cmdb/get_app_local/',
    method: 'get'
  })
}

// export function getAppIntegration() {
//   return request({
//     url: '/cmdb/get_app_integration/',
//     method: 'get'
//   })
// }

export function getProductAppIntegration() {
  return request({
    url: '/cmdb/get_project_app_integration/',
    method: 'get'
  })
}

export function getIpIntegration() {
  return request({
    url: '/cmdb/get_ip_integration/',
    method: 'get'
  })
}

export function addValidation(params) {
  return request({
    url: '/cmdb/deploy_conf_add_validation/',
    method: 'get',
    params: params
  })
}
