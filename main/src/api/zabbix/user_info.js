import request from '@/utils/request2'

export function getUserInfo(query) {
  return request({
    url: '/zabbix/get_user_info',
    method: 'get',
    params: query
  })
}

export function getdepartmentInfo(query) {
  return request({
    url: '/zabbix/get_department_info',
    method: 'get',
    params: query
  })
}

export function getdepartmentInfo2(query) {
  return request({
    url: '/zabbix/get_department_info2',
    method: 'get',
    params: query
  })
}

