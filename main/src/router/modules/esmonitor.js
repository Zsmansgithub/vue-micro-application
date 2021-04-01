/** When your routing table is too long, you can split it into small modules **/

const esMonitorRouter = {
  path: '/esmonitor',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'esmonitor',
  meta: {
    title: 'ES监控',
    roles: ['admin', 'midmonitor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'es_instance_monitor',
      component: () => import('@/views/midmonitor/es_instance'),
      name: 'es_instance_monitor',
      meta: { title: 'ES实例监控' }
    }, {
      path: 'es_instance_detail',
      component: () => import('@/views/midmonitor/es_instance_detail'),
      name: 'es_instance_detail',
      hidden: true,
      meta: { title: 'ES实例监控详情' }
    }
  ]
}

export default esMonitorRouter
