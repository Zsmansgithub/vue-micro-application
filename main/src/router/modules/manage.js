/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import ManageMonitorRouter from './manage_monitor'

const manageRouter = {
  path: '/manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Manage',
  meta: {
    title: '配置管理',
    icon: 'settings',
    roles: ['xadmin']
  },
  children: [
    {
      path: 'process',
      component: () => import('@/views/process/process_monitor'),
      name: 'process_monitor',
      meta: { title: '进程监控' }
    },
    {
      path: 'index',
      component: () => import('@/views/permission/index'),
      name: 'user_config',
      redirect: 'noRedirect',
      meta: { title: '用户管理', roles: ['admin'] },
      children: [
        {
          path: 'user_configs',
          component: () => import('@/views/permission/user_config'),
          name: 'user_configs',
          meta: { title: '用户权限', roles: ['admin'] }
        },
        {
          path: 'group',
          component: () => import('@/views/permission/group'),
          name: 'group',
          meta: { title: '分组权限', roles: ['admin'] }
        },
        {
          path: 'menu_info',
          component: () => import('@/views/permission/menu_info'),
          name: 'menu_info',
          meta: { title: '菜单信息', roles: ['admin'] }
        },
        {
          path: 'menu_group',
          component: () => import('@/views/permission/group_menu'),
          name: 'menu_group',
          meta: { title: '菜单分组管理', roles: ['admin'] }
        },
        {
          path: 'user_info',
          component: () => import('@/views/permission/user_info'),
          name: 'user_info',
          meta: { title: '员工信息', roles: ['admin'] }
        },
        {
          path: 'department',
          component: () => import('@/views/permission/department'),
          name: 'department',
          meta: { title: '部门信息', roles: ['admin'] }
        },
        {
          path: 'virtual',
          component: () => import('@/views/permission/virtual_group'),
          name: 'virtual',
          meta: { title: '虚拟组管理', roles: ['admin'] }
        }
      ]
    },
    ManageMonitorRouter,
    {
      path: 'help_doc',
      component: () => import('@/views/management/help_doc'),
      name: 'help_doc',
      // hidden: true,
      meta: { title: '帮助文档', roles: ['admin'] }
    }, {
      path: 'help_doc_edit',
      component: () => import('@/views/management/help_doc_edit'),
      name: 'help_doc_edit',
      hidden: true,
      meta: { title: '帮助文档编辑', roles: ['admin'] }
    }, {
      path: 'log',
      component: () => import('@/views/cmdb/opr-log'),
      name: 'logconfig',
      meta: { title: '操作日志查询', roles: ['deploy'] }
    }, {
      path: 'alarm_msg_log',
      component: () => import('@/views/zabbix/alarm_msg_log'),
      name: 'alarm_msg_log',
      // hidden: true,
      meta: { title: '短信告警日志', roles: ['admin'] }
    }
  ]
}
export default manageRouter
