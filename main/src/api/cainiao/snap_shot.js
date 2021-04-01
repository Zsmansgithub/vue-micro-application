import request from '@/utils/request2'

export function getSnapShotList(query) {
  return request({
    url: '/cainiao/get_snap_shot',
    method: 'get',
    params: query
  })
}
