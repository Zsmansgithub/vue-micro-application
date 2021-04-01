import request from '@/utils/request2'

export function fetchDomainList(query) {
  return request({
    url: '/cainiao/get_domain_list',
    method: 'get',
    params: query
  })
}

export function updateDomainList(data) {
  return request({
    url: '/cainiao/update_domain_list',
    method: 'post',
    data
  })
}

export function domainDns(query) {
  return request({
    url: '/cainiao/select_domain_dns',
    method: 'get',
    params: query
  })
}

export function domainDnsUpdate(data) {
  return request({
    url: '/cainiao/update_domain_dns',
    method: 'get',
    params: data
  })
}

export function domainDnsEdit(data) {
  return request({
    url: '/cainiao/edit_domain_dns',
    method: 'get',
    params: data
  })
}

export function domainDnsDelete(data) {
  return request({
    url: '/cainiao/delete_domain_dns',
    method: 'post',
    data
  })
}

export function domainDnsSuspend(data) {
  return request({
    url: '/cainiao/stop_domain_dns',
    method: 'get',
    params: data
  })
}

export function domainDnsInsert(data) {
  return request({
    url: '/cainiao/insert_domain_dns',
    method: 'post',
    data
  })
}

export function fetchTypeInfo(query) {
  return request({
    url: '/cainiao/get_type_info',
    method: 'get',
    params: query
  })
}

export function batchDomainDns(query) {
  return request({
    url: '/cainiao/batch_domain_dns',
    method: 'get',
    params: query
  })
}

export function refreshDomain(query) {
  return request({
    url: '/cainiao/refresh_domain',
    method: 'get',
    params: query
  })
}

export function domainLog(query) {
  return request({
    url: '/cainiao/get_domain_log',
    method: 'get',
    params: query
  })
}

export function domainName() {
  return request({
    url: '/cainiao/get_domain_all_name',
    method: 'get'
  })
}

export function domainType() {
  return request({
    url: '/cainiao/get_domain_log_type',
    method: 'get'
  })
}

export function domainRequestLog(query) {
  return request({
    url: '/cainiao/request_domain_log',
    method: 'get',
    params:query
  })
}
