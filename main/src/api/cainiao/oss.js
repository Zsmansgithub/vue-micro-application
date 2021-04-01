import request from '@/utils/request2'

export function getOssList(query) {
  return request({
    url: '/cainiao/get_oss',
    method: 'get',
    params: query
  })
}
