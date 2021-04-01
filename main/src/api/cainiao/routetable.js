import request from '@/utils/request2'

export function getRouteTableList(query) {
  return request({
    url: '/cainiao/get_route_table',
    method: 'get',
    params: query
  })
}
