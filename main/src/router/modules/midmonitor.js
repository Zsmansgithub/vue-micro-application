/** When your routing table is too long, you can split it into small modules **/

const midmonitorRouter = {
  path: '/midmonitor',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'midmonitorroot',
  meta: {
    title: '中间件监控',
    roles: ['middefault', 'midmonitor']
  },
  children: [
    {
      path: 'rocketmqlist',
      component: () => import('@/views/dashboard/dashboard/roctetmq'),
      name: 'rocketmqlist',
      meta: { title: 'RocketMQ大屏', roles: ['midmonitor'] }
    }, {
      path: 'rocketmq_monitor',
      component: () => import('@/views/midmonitor/roctetmq_monitor'),
      name: 'rocketmq_monitor',
      // hidden: true,
      meta: { title: 'RocketMQ监控', roles: ['middefault'] }
    }, {
      path: 'rocketmq_instance',
      component: () => import('@/views/midmonitor/rocketmq_instance'),
      name: 'rocketmq_instance',
      // hidden: true,
      meta: { title: 'RocketMQ实例', roles: ['middefault'] }
    }, {
      path: 'redis_server_monitor',
      component: () => import('@/views/midmonitor/redis_server'),
      name: 'redis_server_monitor',
      // hidden: true,
      meta: { title: 'Redis服务器监控', roles: ['redis_admin'] }
    }, {
      path: 'redis_cluster_monitor',
      component: () => import('@/views/midmonitor/redis_cluster'),
      name: 'redis_cluster_monitor',
      // hidden: true,
      meta: { title: 'Redis集群监控', roles: ['mid_default'] }
    }, {
      path: 'redis_instance_monitor',
      component: () => import('@/views/midmonitor/redis_instance'),
      name: 'redisInstance',
      // hidden: true,
      meta: { title: 'Redis实例监控', roles: ['mid_default'] }
    }, {
      path: 'redis_instance_detail',
      component: () => import('@/views/midmonitor/redis_instance_detail'),
      name: 'redis_instance_detail',
      hidden: true,
      meta: { title: 'Redis实例详情', roles: ['mid_default'] }
    }, {
      path: 'redis_list',
      component: () => import('@/views/midmonitor/redis_list'),
      name: 'redis_list',
      meta: { title: 'Redis队列监控', roles: ['admin', 'redis_admin'] }
    }, {
      path: 'cluster_config',
      component: () => import('@/views/midmonitor/cluster_config'),
      name: 'cluster_config',
      meta: { title: '集群配置管理', roles: ['admin', 'mq_admin'] }
    }, {
      path: 'alarm_history',
      component: () => import('@/views/midmonitor/alarm_history'),
      name: 'alarm_history',
      hidden: true,
      meta: { title: '报警历史' }
    }, {
      path: 'alarm_event',
      component: () => import('@/views/midmonitor/alarm_event'),
      name: 'alarm_event',
      // hidden: true,
      meta: { title: '告警总览', roles: ['mid_admin'] }
    }
  ]
}

export default midmonitorRouter
