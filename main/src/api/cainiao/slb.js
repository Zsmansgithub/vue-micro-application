import request from '@/utils/request2'

export function getSlbList(query) {
  return request({
    url: '/cainiao/get_slb',
    method: 'get',
    params: query
  })
}
