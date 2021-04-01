/** When your routing table is too long, you can split it into small modules **/

const VpcRouter = {
  path: '/vpc',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'vpc',
  meta: {
    title: '专有网络VPC'
    // roles: ['zabbix_admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'vpc',
      component: () => import('@/views/cainiao/vpc'),
      name: 'vpc',
      meta: { title: '专有网络', roles: ['cainiao'] }
    },
    {
      path: 'routetab',
      component: () => import('@/views/cainiao/routetab'),
      name: 'vpc',
      meta: { title: '路由表', roles: ['cainiao'] }
    },
    {
      path: 'switch',
      component: () => import('@/views/cainiao/switch'),
      name: 'switch',
      meta: { title: '交换机', roles: ['cainiao'] }
    },
    {
      path: 'nat',
      component: () => import('@/views/cainiao/nat'),
      name: 'nat',
      meta: { title: 'NAT网关', roles: ['cainiao'] }
    },
    {
      path: 'natpac',
      component: () => import('@/views/cainiao/natpac'),
      name: 'natpac',
      meta: { title: 'NAT带宽包', roles: ['cainiao'] }
    },
    {
      path: 'eipnet',
      component: () => import('@/views/cainiao/eipnet'),
      name: 'eipnet',
      meta: { title: '弹性公网', roles: ['cainiao'] }
    },
    {
      path: 'routeinc',
      component: () => import('@/views/cainiao/routeinc'),
      name: 'routeinc',
      meta: { title: '路由器接口', roles: ['cainiao'] }
    },
    {
      path: 'phycon',
      component: () => import('@/views/cainiao/phycon'),
      name: 'phycon',
      meta: { title: '物理专线', roles: ['cainiao'] }
    },
    {
      path: 'brdroute',
      component: () => import('@/views/cainiao/brdroute'),
      name: 'brdroute',
      meta: { title: '边界路由', roles: ['cainiao'] }
    }
  ]
}
export default VpcRouter
