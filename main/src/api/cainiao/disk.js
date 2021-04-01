import request from '@/utils/request2'

export function getDiskList(query) {
  return request({
    url: '/cainiao/get_disk',
    method: 'get',
    params: query
  })
}
