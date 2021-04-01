import request from '@/utils/request2'

export function telnetTest(query) {
  return request({
    url: '/tools/tool_telnet_telnet_test',
    method: 'post',
    data: query
  })
}

