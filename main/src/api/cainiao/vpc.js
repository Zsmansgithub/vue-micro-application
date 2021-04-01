import request from '@/utils/request2'

export function getVpcList(query) {
  return request({
    url: '/cainiao/get_vpc',
    method: 'get',
    params: query
  })
}
