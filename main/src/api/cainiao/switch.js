import request from '@/utils/request2'

export function getSwitchList(query) {
  return request({
    url: '/cainiao/get_switch',
    method: 'get',
    params: query
  })
}
