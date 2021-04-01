/** When your routing table is too long, you can split it into small modules **/

const URLMonitorRouter = {
  path: '/urlmonitor',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'urlmonitor',
  meta: {
    title: 'URL监控',
    roles: ['zabbix_admin'] // you can set roles in root nav
  },
  children: [
    // {
    //   path: 'url_monitor',
    //   component: () => import('@/views/zabbix/url_monitor'),
    //   name: 'url_monitor',
    //   // hidden: true,
    //   meta: { title: 'URL大屏' }
    // },
    {
      path: 'url_monitor_grid',
      component: () => import('@/views/zabbix/url_monitor_grid'),
      name: 'url_monitor_grid',
      // hidden: true,
      meta: { title: 'URL大屏' }
    },
    {
      path: 'url_check',
      component: () => import('@/views/zabbix/url_check'),
      name: 'url_check',
      // hidden: true,
      meta: { title: 'URL检测' }
    }
  ]
}

export default URLMonitorRouter
