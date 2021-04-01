/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const linkRouter = {
  path: '/link',
  component: Layout,
  redirect: 'noRedirect',
  name: 'link',
  meta: {
    title: '扩展链接',
    icon: 'link',
    roles: ['zabbix_admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'http://10.1.228.170/zabbix/zabbix.php?action=dashboard.view&ddreset=1',
      meta: { title: '集成组Zabbix', roles: ['zabbix_admin'] }
    },
    {
      path: 'http://10.1.194.64/zabbix/zabbix.php?action=dashboard.view',
      meta: { title: '主机组Zabbix', roles: ['zabbix_admin'] }
    }
  ]
}

export default linkRouter
