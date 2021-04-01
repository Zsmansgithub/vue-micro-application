const catMonitorRouter = {
  path: '/catmonitor',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'catmonitor',
  meta: {
    title: 'CAT监控平台',
    roles: ['admin']
  },
  children: [
    {
      path: 'cat_url_monitor',
      component: () => import('@/views/zabbix/cat_url_monitor'),
      name: 'cat_url_monitor',
      // hidden: true,
      meta: { title: 'CAT URL监控', roles: ['admin', 'zabbix'] }
    },
    {
      path: 'cat_heart_beat',
      component: () => import('@/views/zabbix/cat_heart_beat'),
      name: 'cat_heart_beat',
      // hidden: true,
      meta: { title: 'CAT JVM监控', roles: ['admin', 'zabbix'] }
    }
  ]
}

export default catMonitorRouter
