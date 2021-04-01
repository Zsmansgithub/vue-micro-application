import request from '@/utils/request2'

export function getNatPacList(query) {
  return request({
    url: '/cainiao/get_natpac',
    method: 'get',
    params: query
  })
}
