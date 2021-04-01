/** When your routing table is too long, you can split it into small modules **/

const ManageMonitorRouter = {
  path: '/manage_monitor',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'manage_monitor',
  meta: {
    title: '告警配置',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'node_conf',
      component: () => import('@/views/manage_monitor/node_conf'),
      name: 'node_conf',
      meta: { title: '告警分组', roles: ['admin'] }
    }, {
      path: 'triggers_conf',
      component: () => import('@/views/midmonitor/triggers_conf'),
      name: 'triggers_conf',
      // hidden: true,
      meta: { title: '监控项目', roles: ['admin'] }
    }, {
      path: 'alarm_user_conf',
      component: () => import('@/views/midmonitor/alarm_user_conf'),
      name: 'alarm_user_conf',
      // hidden: true,
      meta: { title: '告警联系人', roles: ['admin'] }
    }, {
      path: 'apptable_conf',
      component: () => import('@/views/manage_monitor/apptable_conf'),
      name: 'apptable_conf',
      meta: { title: '监控类型', roles: ['admin'] }
    }, {
      path: 'triggers_template',
      component: () => import('@/views/manage_monitor/triggers_template'),
      name: 'triggers_template',
      meta: { title: '监控项模板', roles: ['admin'] }
    }
  ]
}

export default ManageMonitorRouter
