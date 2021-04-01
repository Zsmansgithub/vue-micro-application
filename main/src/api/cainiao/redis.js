import request from '@/utils/request2'

export function getRedisList(query) {
  return request({
    url: '/cainiao/get_redis',
    method: 'get',
    params: query
  })
}
