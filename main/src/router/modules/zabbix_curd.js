/** When your routing table is too long, you can split it into small modules **/

const zabbixCurdRouter = {
  path: '/zabbix_curd',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'zabbix_curd_name',
  meta: {
    title: 'zabbix操作',
    roles: ['zabbix_curd']
  },
  children: [
    {
      path: 'zabbix_curd_hosts',
      component: () => import('@/views/zabbix/zabbix_curd_hosts'),
      name: 'zabbix_curd_hosts',
      meta: {title: 'zabbix主机', roles: ['zabbix_curd', 'zabbix_curd_admin']}
      // hidden: true
    },
    {
      path: 'api_count',
      component: () => import('@/views/zabbix/api_count'),
      name: 'api_count',
      meta: {title: '登录统计', roles: []},
      hidden: true
    },
  ]
}

export default zabbixCurdRouter
