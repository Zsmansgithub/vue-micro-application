/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import midmonitorRouter from './midmonitor'
import esMonitorRouter from './esmonitor'
import URLMonitorRouter from './urlmonitor'
import catMonitorRouter from './catmonitor'
import sqlMonitorRouter from './sql_monitor'
import zabbixCurdRouter from './zabbix_curd'

const zabbixRouter = {
  path: '/zabbix',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: '监控平台',
    icon: 'monitor4',
    roles: ['monitor', 'zabbix', 'middefault']
  },
  children: [
    {
      path: 'alarm-tables',
      component: () => import('@/views/zabbix/alarm_tables'),
      name: 'AlarmTables',
      meta: { title: '告警平台', roles: ['zabbix'] }
    },
    {
      path: 'zabbix_list_statistics',
      component: () => import('@/views/zabbix/zabbix_list_statistics'),
      name: 'zabbix_list_statistics',
      // hidden: true,
      meta: { title: '告警统计', roles: ['zabbix'] }
    },
    {
      path: 'keyboard',
      component: () => import('@/views/zabbix/zabbix_list'),
      name: 'KeyboardChart',
      meta: { title: '服务器监控', roles: ['zabbix'] }
    },

    midmonitorRouter,
    esMonitorRouter,
    URLMonitorRouter,
    {
      path: 'alarmhistory',
      component: () => import('@/views/zabbix/alarm_history'),
      name: 'alarmhistory',
      meta: { title: '报警历史', roles: ['zabbix'] }
    },
    sqlMonitorRouter,
    zabbixCurdRouter
  ]
}

export default zabbixRouter
