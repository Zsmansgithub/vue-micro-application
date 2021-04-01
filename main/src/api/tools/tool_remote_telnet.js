import request from '@/utils/request2'

export function backValidation(params) {
  return request({
    url: '/tools/tool_remote_telnet_validation/',
    method: 'get',
    params: params
  })
}

export function remoteTelnet(data) {
  return request({
    url: '/tools/tool_remote_telnet/',
    method: 'post',
    data: data
  })
}

export function getTaskResult(params) {
  return request({
    url: '/tools/tool_task_result/',
    method: 'get',
    params: params
  })
}

export function syncWorkFlow(params) {
  return request({
    url: '/tools/tool_sync_workflow/',
    method: 'get',
    params: params
  })
}
