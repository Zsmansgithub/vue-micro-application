import request from '@/utils/request2'

export function getNatList(query) {
  return request({
    url: '/cainiao/get_nat',
    method: 'get',
    params: query
  })
}
