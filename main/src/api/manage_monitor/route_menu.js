import request from '@/utils/request2'
// 菜单信息
export function getMenu(data) {
  return request({
    url: '/user/get_tool_menu',
    method: 'get',
    params: data
  })
}
// 菜单目录(树)
export function getMenuParent() {
  return request({
    url: '/user/get_tool_menu_id',
    method: 'get'
  })
}
// 所有菜单树
export function getAllMenu() {
  return request({
    url: '/user/get_tool_menu_all',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/user/insert_tool_menu',
    method: 'post',
    data
  })
}

export function editMenu(data, id) {
  return request({
    url: `/user/edit_tool_menu/${id}`,
    method: 'put',
    data
  })
}

export function delMenu(id) {
  return request({
    url: `/user/delete_tool_menu/${id}`,
    method: 'delete'
  })
}

// 菜单组
export function getGroupMenu(data) {
  return request({
    url: `/user/get_group_menu`,
    method: 'get',
    params: data
  })
}

export function getAllGroupMenu(data) {
  return request({
    url: `/user/get_group_menu_all`,
    method: 'get'
  })
}

export function addGroupMenu(data) {
  return request({
    url: `/user/insert_group_menu`,
    method: 'post',
    data
  })
}

export function editGroupMenu(data, id) {
  return request({
    url: `/user/edit_group_menu/${id}`,
    method: 'put',
    data
  })
}

export function delGroupMenu(id) {
  return request({
    url: `/user/delete_group_menu/${id}`,
    method: 'delete'
  })
}

export function getAllRoles() {
  return request({
    url: `/user/get_group_all`,
    method: 'get'
  })
}
// 用户权限
export function getUserMenu(data) {
  return request({
    url: '/user/get_user_menu',
    method: 'get',
    params: data
  })
}

export function addUserMenu(data) {
  return request({
    url: '/user/insert_user_menu',
    method: 'post',
    data
  })
}

export function editUserMenu(data, id) {
  return request({
    url: `/user/edit_user_menu/${id}`,
    method: 'put',
    data
  })
}

export function delUserMenu(id) {
  return request({
    url: `/user/delete_user_menu/${id}`,
    method: 'delete'
  })
}
