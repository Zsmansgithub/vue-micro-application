import request from '@/utils/request2'

export function pingTest(query) {
  return request({
    url: '/tools/tool_ping_ping_test',
    method: 'post',
    data: query
  })
}

