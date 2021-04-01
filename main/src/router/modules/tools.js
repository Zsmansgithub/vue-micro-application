/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const toolsRouter = {
  path: '/tools',
  component: Layout,
  // redirect: '/tools/cli/index',
  redirect: 'noRedirect',
  name: 'Tools',
  meta: {
    title: '运维工具',
    icon: 'tool2',
    roles: ['deploy', 'post_package', 'resource_manage','resource_compute']
  },
  children: [
    // {
    //   path: 'restart_server',
    //   component: () => import('@/views/tools/restart_list'), // Parent router-view
    //   name: 'restart_service',
    //   meta: { title: '重启服务' }
    // },
    // {
    //   path: 'cli',
    //   component: () => import('@/views/tools/restart_list'), // Parent router-view
    //   name: 'restart_app',
    //   meta: { title: '重启应用' }
    // },
    {
      path: 'manage_package',
      component: () => import('@/views/tools/manage_package'), // Parent router-view
      name: 'manage_package',
      meta: { title: '软件管理', roles: ['admin', 'post_package', 'post_package_admin'] }
    },
    {
      path: 'resource_compute',
      component: () => import('@/views/tools/resource_compute'), // Parent router-view
      name: 'resource_compute',
      meta: { title: '资源预算',roles:['resource_compute'] }
    },
    {
      path: 'resource_manage',
      component: () => import('@/views/tools/resource_manage'), // Parent router-view
      name: 'resource_manage',
      meta: { title: '预算管理', roles: ['resource_manage'] }
    },
    {
      path: 'syslog',
      component: () => import('@/views/tools/syslog_show'), // Parent router-view
      name: 'syslog',
      meta: { title: '系统日志查询' }
    }
    ,
    {
      path: 'tool_ping',
      component: () => import('@/views/tools/tool_ping'), // Parent router-view
      name: 'tool_ping',
      meta: { title: '连通性测试'}
    },
    {
      path: 'tool_telnet',
      component: () => import('@/views/tools/tool_telnet'), // Parent router-view
      name: 'tool_telnet',
      meta: { title: '端口扫描'}
    }
  ]
}

export default toolsRouter
