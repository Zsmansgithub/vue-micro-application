/** When your routing table is too long, you can split it into small modules **/

const VcenterRouter = {
  path: '/vcenter',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'vcenter',
  meta: {
    title: 'Vcenter管理',
    roles: ['host_manager']
  },
  children: [

  ]
}

export default VcenterRouter
