import request from '@/utils/request2'

export function gePhyconList(query) {
  return request({
    url: '/cainiao/get_phycon',
    method: 'get',
    params: query
  })
}
