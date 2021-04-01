/** When your routing table is too long, you can split it into small modules **/

const EcsRouter = {
  path: '/ecs',
  redirect: 'noRedirect',
  component: () => import('@/views/permission/index'),
  name: 'ecs',
  meta: {
    title: '云主机ECS'
    // roles: ['zabbix_admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'ecs',
      component: () => import('@/views/cainiao/ecs'),
      name: 'ecs',
      meta: { title: '云主机ECS', roles: ['cainiao'] }
    },
    {
      path: 'disk',
      component: () => import('@/views/cainiao/disk'),
      name: 'disk',
      meta: { title: '云盘', roles: ['cainiao'] }
    },
    {
      path: 'image',
      component: () => import('@/views/cainiao/image'),
      name: 'imageconfig',
      // hidden: 'true',
      meta: { title: '镜像', roles: ['cainiao'] }
    },
    {
      path: 'snapshot',
      component: () => import('@/views/cainiao/snap_shot'),
      name: 'snapshotconfig',
      // hidden: 'true',
      meta: { title: '快照', roles: ['cainiao'] }
    },
    {
      path: 'sercuritygroup',
      component: () => import('@/views/cainiao/security_group'),
      name: 'securitygroupconfig',
      // hidden: 'true',
      meta: { title: '安全组', roles: ['cainiao'] }
    }
  ]
}

export default EcsRouter
