import request from '@/utils/request2'

export function getlist(query) {
  return request({
    url: '/archery/sqlworkflow_list',
    method: 'get',
    params: query
  })
}

export function getSqlLog(data) {
  return request({
    url: '/archery/workflow/log',
    method: 'post',
    data
  })
}
// sql工单查询条件下拉数据
export function getSqlWorkflowQuery() {
  return request({
    url: `/archery/sqlworkflow`,
    method: 'get'
  })
}

// sql提交
// 获取项目
export function getSqlWorkflow(params) {
  return request({
    url: `/archery/listgroup`,
    method: 'get',
    params
  })
}

export function getDetailContent(query) {
  return request({
    url: `/archery/sqlworkflow/detail_content`,
    method: 'get',
    params: query
  })
}

export function getDetailWorkflow(query) {
  return request({
    url: `/archery/detail`,
    method: 'get',
    params: query
  })
}

// 审核通过 不执行
export function sqlPassed(data) {
  return request({
    url: `/archery/passed`,
    method: 'post',
    data
  })
}
// 可执行时间变更
export function alterRunDate(data) {
  return request({
    url: `archery/alter_run_date`,
    method: 'post',
    data
  })
}

// 执行/手动执行
export function doExecute(data) {
  return request({
    url: `archery/execute`,
    method: 'post',
    data
  })
}

// 定时执行
export function doTimingtask(data) {
  return request({
    url: `archery/timingtask`,
    method: 'post',
    data
  })
}

// 定时执行
export function doCancel(data) {
  return request({
    url: `archery/cancel`,
    method: 'post',
    data
  })
}

// 获取回滚sql
export function getSqlBack(query) {
  return request({
    url: `/archery/sqlworkflow/backup_sql`,
    method: 'get',
    params: query
  })
}

// 下载回滚sql
export function downSqlBack(query) {
  return request({
    url: `/archery/rollback`,
    responseType: 'blob',
    method: 'get',
    params: query
  })
}

// 根据实例搜索所在分组
export function searchByInstance(query) {
  return request({
    url: `/archery/group/searchByInstance`,
    method: 'post',
    data: query
  })
}

// 实例模糊搜索
export function instanceFuzzy(query) {
  return request({
    url: `/archery/instance/search`,
    method: 'post',
    data: query
  })
}

// 获取实例
export function getGroupInstance(query) {
  return request({
    url: `/archery/group/instances`,
    method: 'post',
    data: query
  })
}
// 获取数据库
export function getSqlRollBackDb(query) {
  return request({
    url: `/archery/instance/instance_resource`,
    method: 'get',
    params: query
  })
}

// sql检测
export function sqlSimplecheck(data) {
  return request({
    url: `/archery/simplecheck`,
    method: 'post',
    data
  })
}
// sql提交
export function sqlAutoreview(data) {
  return request({
    url: `/archery/autoreview`,
    method: 'post',
    data
  })
}

export function getGroupAuditors(query) {
  return request({
    url: `/archery/group/auditors`,
    method: 'post',
    data: query
  })
}
export function getWorkflowStatus(data) {
  return request({
    url: `archery/getWorkflowStatus`,
    method: 'post',
    data
  })
}
// 用于mysql控制osc执行
export function getInception(query) {
  return request({
    url: `/archery/inception/osc_control`,
    method: 'post',
    data: query
  })
}

// sql分析页面

// 获取实例
export function getAllInstances(data) {
  return request({
    url: `archery/group/user_all_instances`,
    method: 'get',
    params: data
  })
}

// sql分析
export function doAnalyze(data) {
  return request({
    url: `/archery/sql_analyze/analyze`,
    method: 'post',
    data
  })
}
// 生成
export function doGenerate(data) {
  return request({
    url: `/archery/sql_analyze/generate`,
    method: 'post',
    data
  })
}
/* 优化工具 */

// 获取优化建议(create语句)
export function sqltuning(data) {
  return request({
    url: `/archery/slowquery/optimize_sqltuning`,
    method: 'post',
    data
  })
}

// 获取优化建议(其他语句?)
export function sqladvisor(data) {
  return request({
    url: `/archery/slowquery/optimize_sqladvisor`,
    method: 'post',
    data
  })
}

// 获取优化建议(其他语句?)
export function sqlsoar(data) {
  return request({
    url: `/archery/slowquery/optimize_soar`,
    method: 'post',
    data
  })
}

/* 慢查日志 */

// 慢查日志查询记录
export function slowqueryList(data) {
  return request({
    url: `/archery/slowquery/review`,
    method: 'post',
    data
  })
}

// 慢查日志查询记录
export function slowqueryReport(query) {
  return request({
    url: `/archery/slowquery/report?checksum=${query}`,
    method: 'get'
  })
}

// 慢查日志明细记录
export function slowqueryDetailList(data) {
  return request({
    url: `/archery/slowquery/review_history`,
    method: 'post',
    data
  })
}


// 获取所有数据库数据
export function getAllDBs() {
  return request({
    url: `/archery/instance/get_all_dbs`,
    // url: `/instance/get_all_dbs`,
    method: 'get'
  })
}
// 权限申请校验表数据是否正确
export function applyforprivileges(data) {
  return request({
    url: `/archery/query/applyforprivileges`,
    method: 'post',
    data
  })
}
