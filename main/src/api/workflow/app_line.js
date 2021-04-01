import request from '@/utils/request2'
// 不分页接口
export function getWorkFlowLine() {
  return request({
    url: '/workflow/getlinenew',
    method: 'get'
  })
}
// 节点控制
export function getLineAndNodes(query) {
  return request({
    url: '/workflow/lineandnodes',
    method: 'get',
    params: query
  })
}
// 申请单管理 委托办理
export function workflownodesentrust(data) {
  return request({
    url: '/workflow/workflow_nodes_entrust',
    method: 'POST',
    data
  })
}
// 申请单管理 委托办理2
export function get_workflownodesentrust() {
  return request({
    url: '/workflow/workflow_nodes_entrust2',
    method: 'get',
  })
}
export function post_workflownodesentrust(data) {
  return request({
    url: '/workflow/workflow_nodes_entrust2',
    method: 'POST',
    data
  })
}
// 申请单管理 导出：虚拟机申请 服务器下线
export function get_workflowdata(data) {
  return request({
    url: '/workflow/export_workflow_data',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
