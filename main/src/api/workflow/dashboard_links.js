import request from '@/utils/request2'

export function get_links(query) {
  return request({
    url: '/cmdb/get_links',
    method: 'get',
    params: query
  })
}

export function get_links_all() {
  return request({
    url: '/cmdb/get_links_all',
    method: 'get'
  })
}

export function add_links(data) {
  return request({
    url: '/cmdb/add_links',
    method: 'post',
    data
  })
}

export function delete_links(id) {
  return request({
    url: '/cmdb/delete_links/' + id,
    method: 'delete'
  })
}
