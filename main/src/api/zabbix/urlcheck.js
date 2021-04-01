import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/zabbix/url_check/',
    method: 'get',
    params: query
  })
}

export function addRow(data) {
  return request({
    url: '/zabbix/url_check/',
    method: 'post',
    data
  })
}

export function deleteRow(row_id) {
  return request({
    url: '/zabbix/url_check/' + row_id + '/',
    method: 'delete'
  })
}

export function editRow(row_id, data) {
  return request({
    url: '/zabbix/url_check/' + row_id + '/',
    method: 'put',
    data
  })
}

// export function getAppName() {
//   return request({
//     url: '/zabbix/app_name_list/',
//     method: 'get'
//   })
// }

export function getSMSList() {
  return request({
    url: '/zabbix/sms_list/',
    method: 'get'
  })
}

export function getLocalAppName() {
  return request({
    url: '/zabbix/local_app_name_list/',
    method: 'get'
  })
}

export function getPathList() {
  return request({
    url: '/zabbix/get_path_list/',
    method: 'get'
  })
}

export function handleURL(id) {
  return request({
    url: '/zabbix/handle_url/?id=' + id,
    method: 'get'
  })
}

export function createRList(data) {
  return request({
    url: '/zabbix/bulk_create_url/',
    method: 'post',
    data
  })
}
