import request from '@/utils/request2'

export function getBrdRouteList(query) {
  return request({
    url: '/cainiao/get_brdroute',
    method: 'get',
    params: query
  })
}
