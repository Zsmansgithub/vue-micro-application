/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const dashRouter = {
  path: '/',
  component: Layout,
  redirect: 'dashboard',
  name: 'dashboard',
  alwaysShow: true,
  activeMenu: 'dashboard',
  meta: { title: 'Dashboard', icon: 'dashboard' },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      hidden: true,
      breadcrumb: false,
      meta: { title: 'Dashboard', affix: true }
    },
    {
      path: 'rockmqs',
      component: () => import('@/views/dashboard/dashboard/roctetmq'),
      name: 'rockmqs',
      meta: { title: 'RocketMQ大屏', roles: ['zabbix_admin', 'midmonitor'] }
    },
    {
      path: 'devops',
      component: () => import('@/views/dashboard/dashboard/esdashboard'),
      name: 'devops',
      meta: { title: '运维监控大屏', roles: ['zabbix_admin'] }
    },
    // {
    //   path: 'url',
    //   component: () => import('@/views/zabbix/url_monitor'),
    //   name: 'url',
    //   meta: { title: 'URL监控大屏', roles: ['zabbix_admin'] }
    // },
    {
      path: 'url_grid',
      component: () => import('@/views/zabbix/url_monitor_grid'),
      name: 'url_grid',
      meta: { title: 'URL监控大屏', roles: ['zabbix_admin'] }
    },
    {
      path: 'server_grid',
      component: () => import('@/views/dashboard/dashboard/server_monitor_grid'),
      name: 'server_grid',
      meta: { title: '服务器告警大屏', roles: ['zabbix_admin'] }
    },
    {
      path: 'help_doc_preview',
      component: () => import('@/views/management/help_doc_preview'),
      name: 'help_doc_preview',
      hidden: true,
      meta: { title: '帮助文档' }
    }
  ]
}

export default dashRouter
