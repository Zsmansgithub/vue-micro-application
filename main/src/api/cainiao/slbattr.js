import request from '@/utils/request2'

export function getListenPortById(query) {
  return request({
    url: '/cainiao/get_listen_port',
    method: 'get',
    params: query
  })
}
