import request from '@/utils/request2'

export function getRdsList(query) {
  return request({
    url: '/cainiao/get_rds',
    method: 'get',
    params: query
  })
}
