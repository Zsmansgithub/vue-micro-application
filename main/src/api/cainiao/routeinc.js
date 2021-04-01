import request from '@/utils/request2'

export function geRouteIncList(query) {
  return request({
    url: '/cainiao/get_routeinc',
    method: 'get',
    params: query
  })
}
