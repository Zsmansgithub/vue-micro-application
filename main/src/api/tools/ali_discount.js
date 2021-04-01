import request from '@/utils/request2'

export function getRow(query) {
  return request({
    url: '/tools/ali_discount/',
    method: 'get',
    params: query
  })
}

export function getQueryOptions() {
  return request({
    url: '/tools/get_discount_options/',
    method: 'get'
  })
}
