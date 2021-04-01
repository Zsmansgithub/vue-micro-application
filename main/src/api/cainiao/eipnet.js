import request from '@/utils/request2'

export function getEipnetList(query) {
  return request({
    url: '/cainiao/get_eipnet',
    method: 'get',
    params: query
  })
}
