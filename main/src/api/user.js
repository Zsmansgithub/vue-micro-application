import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function loginjwt(data) {
  return request({
    url: '/user/loginjwt',
    method: 'post',
    data
  })
}

export function loginDD(code) {
  return request({
    url: '/user/logindd_server',
    method: 'get',
    params: { code }
  })
}

export function loginDD_h5(code) {
  return request({
    url: '/user/logindd_h5',
    method: 'get',
    params: { code }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
