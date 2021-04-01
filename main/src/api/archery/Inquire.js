import request from '@/utils/request2'

/**
 * 查询历史
 * @param {star} 是否收藏(true, false)
 * @param {query_log_id} 具体id
 * @param {limit} 分页
 * @param {search} 搜索
 */
export function getQuerylog(query) {
  return request({
    url: '/archery/query/querylog',
    method: 'get',
    params: query
  })
}

/**
 * 已收藏查询历史
 */
export function getSqlquery(data) {
  return request({
    url: '/archery/sqlquery',
    method: 'post',
    data
  })
}

/**
 * 在线查询、执行计划
 * @param {instance_name}:组；
 * @param {db_name}:数据库名称；
 * @param {tb_name}:表明；
 * @param {sql_content}:查询sql语句；
 * @param {limit_num}: 返回行数   ；
 * @param {schama_name}:
 */
export function submitInquire(data) {
  return request({
    url: '/archery/query',
    method: 'post',
    data
  })
}

/**
 * 查询表语句
 * @param {instance_name}:集群
 * @param {db_name}:实例
 * @param {tb_name}:表
 * @param {schema_name}
 */
export function getDescribetable(data) {
  return request({
    url: '/archery/instance/describetable',
    method: 'post',
    data
  })
}

/**
 * 收藏
 * @param {query_log_id}:id；
 * @param {star}:true；
 * @param {alias}:别名；
 */
export function favorite(data) {
  return request({
    url: '/archery/query/favorite',
    method: 'post',
    data
  })
}
