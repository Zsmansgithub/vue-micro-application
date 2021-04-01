import request from '@/utils/request2'

export function getApp(params) {
  return request({
    url: '/cmdb/get_app/',
    method: 'get',
    params: params
  })
}

export function getIP(params) {
  return request({
    url: '/cmdb/get_ip/',
    method: 'get',
    params: params
  })
}
