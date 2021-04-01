import request from '@/utils/request_response'

export function fetchList(query) {
  return request({
    url: '/tools/get_syslog_list',
    method: 'get',
    params: query
  })
}
