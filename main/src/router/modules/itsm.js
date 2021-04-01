/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const itsmRouter = {
  path: '/itsm',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true,
  name: 'itsm',
  // hidden: true,
  meta: {
    title: '事件管理',
    icon: 'form',
    roles: ['workflow_event'] // you can set roles in root nav
  },
  children: [
    {
      path: 'system_availability_information',
      component: () => import('@/views/itsm/system_availability_information'),
      name: 'system_availability_information',
      meta: { title: '系统可用性信息', roles: ['workflow_event'] }
      // hidden: true
    },
    {
      path: 'change_operate',
      component: () => import('@/views/itsm/change_operate'),
      name: 'change_operate',
      meta: { title: '变更管理' }
      // hidden: true
    }
  ]
}

export default itsmRouter
