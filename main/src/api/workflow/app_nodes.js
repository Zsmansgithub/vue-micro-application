import request from '@/utils/request2'

export function getNodes(query) {
  return request({
    url: '/workflow/nodes',
    method: 'get',
    params: query
  })
}

export function editWorkflowNode(row_id, data) {
  return request({
    url: '/workflow/updatenode/' + row_id,
    method: 'put',
    data
  })
}

export function addWorkFlowNode(formdata) {
  return request({
    url: '/workflow/nodes',
    method: 'post',
    data: formdata
  })
}

export function getNodesName(row_id) {
  return request({
    url: '/workflow/nodesname/' + row_id + '/',
    method: 'get'
  })
}

export function delWorkFlowNode(row_id) {
  return request({
    url: '/workflow/updatenode/' + row_id,
    method: 'delete'
  })
}

// 设置默认节点
export function setDefaultNode(row_id) {
  return request({
    url: '/workflow/set_default_node/' + row_id,
    method: 'get'
  })
}
