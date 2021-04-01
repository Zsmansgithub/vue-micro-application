import request from '@/utils/request2'

// 系统异常情况
export function getlist1(query) {
  return request({
    url: 'itsm/system_break_total_views?' + query,
    method: 'get'
  })
}

// 系统异常情况汇总
export function getlist2(query) {
  return request({
    url: 'itsm/blame_department_total_views?' + query,
    method: 'get'
  })
}

// 按业务线分类
export function getlist3(query) {
  return request({
    url: 'itsm/application_distinguish_total_views?' + query,
    method: 'get'
  })
}

// 按产品线分类
export function getlist4(query) {
  return request({
    url: 'itsm/application_distinguish_product_total_views?' + query,
    method: 'get'
  })
}

// 按异常原因分类
export function getlist5(query) {
  return request({
    url: 'itsm/abnormal_reason_dict_total_views?' + query,
    method: 'get'
  })
}

// 按异常星级分类
export function getlist6(query) {
  return request({
    url: 'itsm/abnormal_end_class_total_views?' + query,
    method: 'get'
  })
}

// 核心系统/模块系统稳定率（最近13个月）
export function getlist7(query) {
  return request({
    url: 'itsm/system_stability_recently_month_views?' + query,
    method: 'get'
  })
}

// 本月环比上月/本月同比去年
// 最近13个月各类故障统计
export function getlist8(query) {
  return request({
    url: 'itsm/nowtime_vs_last_total_views?' + query,
    method: 'get'
  })
}

// 最近13个月各类故障统计
export function getlist10(query) {
  return request({
    url: 'itsm/product_abnormal_max_views?' + query,
    method: 'get'
  })
}

// 最近13个月各类故障统计
export function getlist11(query) {
  return request({
    url: 'itsm/end_class_abnormal_max_views?' + query,
    method: 'get'
  })
}
