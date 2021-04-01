import request from '@/utils/request2'
// 每天：驳回、完成、未完成
export function getdayworkflownumData(listQuery) {
  return request({
    url: '/workflow/workflow_conf_line_chart_data',
    method: 'get',
    params: listQuery
  })
}
// 申请单：驳回、完成、未完成 （按总数排序）
export function getstatusworkflownumData(listQuery) {
  return request({
    url: '/workflow/workflow_status_statistics',
    method: 'get',
    params: listQuery
  })
}
// 未完成 节点
export function getnodeworkflownumData(listQuery) {
  return request({
    url: '/workflow/workflow_unfinished_node_statistics',
    method: 'get',
    params: listQuery
  })
}
// 申请单时长（排序）
export function getnodeworkflowtimeData(listQuery) {
  return request({
    url: '/workflow/workflow_c_time_statistics',
    method: 'get',
    params: listQuery
  })
}
// 大表格（部门->部门成员->参与申请单）
export function getworkflowtimetableData(listQuery) {
  return request({
    url: '/workflow/workflow_statistics_detail_table_data',
    method: 'get',
    params: listQuery
  })
}

// 节点时长 表格 （不包含 新建申请单、提交申请单、审批完成）
export function getworkflownodetimetableData(listQuery) {
  return request({
    url: '/workflow/workflow_c_time_table_data',
    method: 'get',
    params: listQuery
  })
}

// 每个申请单 耗时
export function getworkflowtableData(listQuery) {
  return request({
    url: '/workflow/workflow_c_time_table_data_2',
    method: 'get',
    params: listQuery
  })
}

// top10
export function gettopData(listQuery) {
  return request({
    url: '/workflow/workflow_join_user_top_10',
    method: 'get',
    params: listQuery
  })
}
