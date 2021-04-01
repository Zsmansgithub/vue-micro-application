/** When your routing table is too long, you can split it into small modules **/

const sqlMonitorRouter = {
  path: '/sql_monitor',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'sql_monitor_name',
  meta: {
    title: 'SQL任务',
    roles: ['sql_monitor']
  },
  children: [
    {
      path: 'sql_monitor_alarming_now',
      component: () => import('@/views/zabbix/sql_monitor_alarming_now'),
      name: 'sql_monitor_alarming_now',
      meta: { title: '当前异常', roles: ['sql_monitor', 'sql_monitor_admin'] }
      // hidden: true
    },
    {
      path: 'sql_monitor_database_info',
      component: () => import('@/views/zabbix/sql_monitor_database_info'),
      name: 'sql_monitor_database_info',
      meta: { title: '数据库配置', roles: ['sql_monitor', 'sql_monitor_admin'] }
    },
    {
      path: 'sql_monitor_tasks',
      component: () => import('@/views/zabbix/sql_monitor_tasks'),
      name: 'sql_monitor_tasks',
      meta: { title: 'SQL任务配置', roles: ['sql_monitor', 'sql_monitor_admin'] }
      // hidden: true
    },
    {
      path: 'universal_alarm_trigger',
      component: () => import('@/views/zabbix/sql_monitor_triggers'),
      name: 'sql_monitor_triggers',
      meta: { title: '触发器', roles: ['sql_monitor', 'sql_monitor_admin'] }
      // hidden: true
    },
    {
      path: 'universal_alarm_alarm',
      component: () => import('@/views/zabbix/sql_monitor_alarm'),
      name: 'sql_monitor_alarm',
      meta: { title: '警报器', roles: ['sql_monitor', 'sql_monitor_admin'] }
      // hidden: true
    },
    {
      path: 'sql_monitor_alarm_history',
      component: () => import('@/views/zabbix/sql_monitor_alarm_history'),
      name: 'sql_monitor_alarm_history',
      meta: { title: '告警记录', roles: ['sql_monitor', 'sql_monitor_admin'] }
      // hidden: true
    }
  ]
}

export default sqlMonitorRouter
