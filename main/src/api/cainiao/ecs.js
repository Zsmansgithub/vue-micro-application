import request from '@/utils/request2'

export function getEcsList(query) {
  return request({
    url: '/cainiao/get_ecs',
    method: 'get',
    params: query
  })
}
export function startEcs(query) {
  return request({
    url: '/cainiao/start_ecs',
    method: 'get',
    params: query
  })
}
export function stopEcs(query) {
  return request({
    url: '/cainiao/stop_ecs',
    method: 'get',
    params: query
  })
}

export function restartEcs(query) {
  return request({
    url: '/cainiao/restart_ecs',
    method: 'get',
    params: query
  })
}

export function getEcsConnection(query) {
  return request({
    url: '/cainiao/get_ecs_connection',
    method: 'get',
    params: query
  })
}

export function getStatisticsCainiao(query) {
  return request({
    url: '/cainiao/get_static_all_table',
    method: 'get',
    params: query
  })
}
