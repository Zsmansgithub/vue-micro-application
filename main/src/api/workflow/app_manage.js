import request from '@/utils/request2'

export function getWorkFlows(query) {
  return request({
    url: '/workflow/create',
    method: 'get',
    params: query
  })
}

export function getWorkFlowsHistory(query) {
  return request({
    url: '/workflow/history',
    method: 'get',
    params: query
  })
}

// export function getWorkFlowLine() {
//   return request({
//     url: '/workflow/getline',
//     method: 'get'
//   })
// }
// 新建申请单
export function addWorkFlow(workflowline, formdata) {
  const data = { values: JSON.stringify(formdata), app_cname: (formdata.app_name), comments: (formdata.desc) ? (formdata.desc) : ('新建申请单'), step_line: workflowline, status: 0 }
  console.log(data)
  return request({
    url: '/workflow/create',
    method: 'post',
    data
  })
}
// 保存草稿
export function saveDraftsWorkFlow(workflowline, formdata) {
  const data = { values: JSON.stringify(formdata), app_cname: (formdata.app_name), comments: (formdata.desc) ? (formdata.desc) : ('新建申请单'), step_line: workflowline, status: 1 }
  console.log(data)
  return request({
    url: '/workflow/create',
    method: 'post',
    data
  })
}

export function updateWorkFlow(id, data) {
  return request({
    url: `/workflow/1/${id}`,
    method: 'put',
    data
  })
}

export function updateWorkFlow1(id, data) {
  return request({
    url: `/workflow/2/${id}`,
    method: 'put',
    data
  })
}

export function updateWorkFlow2(id, data) {
  return request({
    url: `/workflow/3/${id}`,
    method: 'put',
    data
  })
}

export function handleWorkFlow(id, data) {
  return request({
    url: `/workflow/handle/${id}`,
    method: 'put',
    data
  })
}

export function deleteWorkFlow(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

// 获取数据渲染表格
// export function getWorkFlowLineRow(query) {
//   return request({
//     url: '/workflow/getWorkFlowLine',
//     method: 'get',
//     params: query
//   })
// }

// 获取应用申请类型，供下拉列表使用
export function getApplyType() {
  return request({
    url: '/workflow/get_apply_type',
    method: 'get'
  })
}

// 新增申请单类型
export function addWorkFlowLineRow(data) {
  return request({
    url: '/workflow/createWorkFlowLine',
    method: 'post',
    data
  })
}

// 修改申请单类型
export function editWorkFlowLineRow(row_id, data) {
  return request({
    url: '/workflow/updateWorkFlowLine/' + row_id + '/',
    method: 'put',
    data
  })
}

// 删除申请单类型
export function deleteWorkFlowLineRow(id) {
  return request({
    url: `/workflow/updateWorkFlowLine/${id}/`,
    // patch为局部修改接口方法
    method: 'patch',
    // 指定要修改的数据
    data: {
      // 指定status为2的为软删除的数据，不在列表展示
      'status': 2
    }
  })
}

// 获取工作流日志信息列表
export function getWorkFlowLog(query) {
  return request({
    url: `/workflow/getlog`,
    method: 'get',
    params: query
  })
}

// 获取自己的草稿
export function getDraftsWorkFlows(query) {
  return request({
    url: '/workflow/drafts',
    method: 'get',
    params: query
  })
}

export function getWorkFlowsMyHistory(query) {
  return request({
    url: '/workflow/myhistory',
    method: 'get',
    params: query
  })
}

// 修改草稿申请单内容后提交
export function editWorkFlowConfRow(row_id, formdata, status) {
  console.log(formdata)
  // routeParams里的detailData_edit还有values 会导致values重复 且数据量过大
  delete formdata.routeParams
  const data = { values: JSON.stringify(formdata), app_cname: (formdata.app_name), comments: (formdata.desc) ? (formdata.desc) : ('新建申请单'), 'status': status }
  console.log(data)
  return request({
    url: '/workflow/updateWorkFlowConf/' + row_id + '/',
    method: 'patch',
    data
  })
}

// 删除草稿申请单
export function deleteWorkFlowConfRow(id) {
  return request({
    url: `/workflow/updateWorkFlowConf/${id}/`,
    // patch为局部修改接口方法
    method: 'patch',
    // 指定要修改的数据
    data: {
      // 指定status为2的为软删除的数据，不在列表展示
      'status': 2
    }
  })
}

// 获取工作流操作列表
export function getWorkHandler() {
  return request({
    url: `/workflow/handler`,
    method: 'get'
  })
}

// workflowline start
export function getWorkflowline(query) {
  return request({
    url: '/workflow/getline',
    method: 'get',
    params: query
  })
}

export function getWorkflowparentline(query) {
  return request({
    url: '/workflow/getparentline',
    method: 'get',
    params: query
  })
}

export function addWorkflowline(data) {
  return request({
    url: '/workflow/getline',
    method: 'post',
    data
  })
}

// export function deleteWorkflowline(row_id) {
//   return request({
//     url: '/workflow/updateline/'+ row_id,
//     method: 'get',
//     // method: 'delete'
//   })
// }

export function deleteWorkflowline(row_id, data) {
  return request({
    url: '/workflow/updateline/' + row_id,
    method: 'get',
    params: {
      'is_delete': data
    }
    // method: 'delete'
  })
}

export function getWFLine(row_id) {
  return request({
    url: '/workflow/updateline/' + row_id,
    method: 'get'
    // method: 'delete'
  })
}

export function editWorkflowline(row_id, data) {
  return request({
    url: '/workflow/updateline/' + row_id,
    method: 'put',
    data
  })
}

// 批量修改申请单的一级分类和状态
export function batchEditWorkflowline(data) {
  return request({
    url: '/workflow/batch_edit_line/',
    method: 'POST',
    data
  })
}

// 物理机信息
export function getphysical() {
  return request({
    url: `/workflow/get_pm_conf`,
    method: 'get'
  })
}

// 审批按钮 提醒
export function getnotice(query) {
  return request({
    url: '/workflow/noticeworkflow',
    method: 'get',
    params: query
  })
}

// 防火墙 目的ip 10.5 或 10.6 段
export function getfirewalldip(query) {
  return request({
    url: '/workflow/get_10_5_and_10_6',
    method: 'get',
    params: query
  })
}

// 防火墙 目的ip 10.5 或 10.6 段 产品线
export function getdipProductAppCascader() {
  return request({
    url: '/workflow/get_10_5_and_10_6_cascade',
    method: 'get'
  })
}

// 当前节点 审批人
export function getworkflowuser(query) {
  return request({
    url: '/workflow/workflow_mangae_user',
    method: 'get',
    params: query
  })
}

// Redis 验证应用是否重名
export function getredisappname(query) {
  return request({
    url: '/midmonitor/redis/app_validation/',
    method: 'get',
    params: query
  })
}
// 待审批Redis工单 验证应用是否重名
export function get_workflowRedisappname(data) {
  return request({
    url: '/workflow/workflow_redis_as_name',
    method: 'post',
    data
  })
}
// Redis工单详情 按钮：手动同步到cachecloud
export function get_Rediscachecloud(data) {
  return request({
    url: '/workflow/workflow_redis_to_cachecloud',
    method: 'post',
    data
  })
}

// 系统可用性 未提交报告标题
export function getnoreporttitle() {
  return request({
    url: '/itsm/workflow_itsm_title',
    method: 'get'
  })
}

// 内网防火墙 集群配置管理 获取ES/MQ ip:port
export function get_esmq_ipport() {
  return request({
    url: '/midmonitor/cluster_cascader/',
    method: 'get'
  })
}
// 内网防火墙 集群配置管理 获取mysql/oracle/mongodb ip:port
export function get_dbcluster_ipport() {
  return request({
    url: '/zabbix/db_cluster_for_internal_firewall',
    method: 'get'
  })
}
// 内网防火墙 集群配置管理 获取redis ip:port
export function get_redis_ipport() {
  return request({
    url: `/midmonitor/redis/get_redis_firewall/`,
    method: 'get'
  })
}
// 内网防火墙 集群配置管理 获取ES/MQ/mysql/oracle/mongodb/redis ip:port 还有自定义集群
export function get_all_ipport() {
  return request({
    url: `/tools/get_all_config_firewall`,
    method: 'get'
  })
}

// 公共MQtopic 主题名称
export function get_mqtopicname() {
  return request({
    url: '/midmonitor/get_topic_name_list',
    method: 'get'
  })
}

// 批量添加IP 内网防火墙 mysqloracle权限 mongodb权限
export function getIpList(query) {
  return request({
    url: '/cmdb/get_resource_list2',
    method: 'get',
    params: query
  })
}

// 产品线申请单 git地址
export function get_gitaddr() {
  return request({
    url: '/cmdb/get_product_git/',
    method: 'get'
  })
}
// 发布申请 选择包
export function select_bao(data) {
  return request({
    url: '/archery/listFiles',
    method: 'post',
    data
  })
}
