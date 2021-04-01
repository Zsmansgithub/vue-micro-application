import request from '@/utils/request2'

export function getsecurityGroupList(query) {
  return request({
    url: '/cainiao/get_security_group',
    method: 'get',
    params: query
  })
}
