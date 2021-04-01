/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import EcsRouter from './ecs'
import VpcRouter from './vpc'

const cainiaoRouter = {
  path: '/cainiao',
  component: Layout,
  redirect: 'noRedirect',
  name: 'cainiaoconfig',
  meta: {
    title: '云管平台',
    icon: 'yun',
    roles: ['cainiao', 'domain_define', 'network', 'f5_gtm_dns_define', 'data_resource_manage'] // you can set roles in root nav
  },
  children: [
    {
      path: 'loadbalance_info',
      component: () => import('@/views/cainiao/loadbalance_info'),
      name: 'loadbalance_info',
      meta: { title: '负载均衡', roles: ['network', 'loadbalance'] }
    },
    {
      path: 'index2',
      component: () => import('@/views/permission/index'),
      name: 'f5ltm',
      meta: { title: 'LTM管理', roles: ['ltm_node', 'ltm_pool', 'line_ip_bind', 'ltm_vs'] },
      children: [
        {
          path: 'ltm_basic',
          component: () => import('@/views/cainiao/ltm_basic'),
          name: 'ltm_basic',
          meta: { title: '基本信息' }
        },
        {
          path: 'ltm_node',
          component: () => import('@/views/cainiao/ltm_node'),
          name: 'ltm_node',
          meta: { title: 'Node信息' },
          roles: ['ltm_node']
        },
        {
          path: 'ltm_pool',
          component: () => import('@/views/cainiao/ltm_pool'),
          name: 'ltm_pool',
          meta: { title: 'Pool信息' },
          roles: ['ltm_pool']
        },
        {
          path: 'ltm_vs',
          component: () => import('@/views/cainiao/ltm_vs'),
          name: 'ltm_vs',
          meta: { title: 'VS信息' },
          roles: ['ltm_vs']
        },
        {
          path: 'ltm_monitor',
          component: () => import('@/views/cainiao/ltm_monitor'),
          name: 'ltm_monitor',
          // hidden:'true',
          meta: { title: '监控信息' }
        },
        {
          path: 'ltm_fail_log',
          component: () => import('@/views/cainiao/ltm_fail_log'),
          name: 'ltm_fail_log',
          meta: { title: '失败日志' },
          roles: []
        }
      ]
    },
    {
      path: 'index1',
      component: () => import('@/views/permission/index'),
      name: 'user_config',
      meta: { title: '公网域名', roles: ['cainiao', 'domain_admin', 'domain_define'] },
      children: [
        {
          path: 'domain',
          component: () => import('@/views/cainiao/domain'),
          name: 'domain',
          meta: { title: '域名列表' },
          roles: ['cainiao', 'domain_admin', 'domain_define']
        },
        {
          path: 'domain_dns',
          component: () => import('@/views/cainiao/domain_dns'),
          name: 'domain_dns',
          meta: { title: '解析记录' },
          roles: ['cainiao', 'domain_admin', 'domain_define']
        },
        {
          path: 'domain_log',
          component: () => import('@/views/cainiao/domain_log'),
          name: 'domain_log',
          meta: { title: '日志信息' }
        }
      ]
    },
    {
      path: 'index',
      component: () => import('@/views/permission/index'),
      name: 'user_config',
      meta: { title: '内网域名', roles: ['f5_gtm_dns_define', 'f5_gtm_dns', 'f5_gtm_dns_delete_batch'] },
      children: [
        {
          path: 'f5_dns_basic',
          component: () => import('@/views/cainiao/f5_dns_basic'),
          name: 'f5_dns_basic',
          meta: { title: '基本信息' }
        },
        {
          path: 'f5_dns_server',
          component: () => import('@/views/cainiao/f5_dns_server'),
          name: 'f5_dns_server',
          meta: { title: 'Server信息' }
        },
        {
          path: 'f5_dns_pool',
          component: () => import('@/views/cainiao/f5_dns_pool'),
          name: 'f5_dns_pool',
          meta: { title: 'Pool信息' }
        },
        {
          path: 'f5_dns_wideIp',
          component: () => import('@/views/cainiao/f5_dns_wideIp'),
          name: 'f5_dns_wideIp',
          meta: { title: 'WideIp信息' }
        },
        {
          path: 'f5_dns_monitor',
          component: () => import('@/views/cainiao/f5_dns_monitor'),
          name: 'f5_dns_monitor',
          meta: { title: '监控信息' }
        },
        {
          path: 'f5_fail_log',
          component: () => import('@/views/cainiao/f5_fail_log'),
          name: 'f5_fail_log',
          meta: { title: '失败日志' }
        }
      ]
    },
    {
      path: 'data_in_and_out',
      component: () => import('@/views/cmdb/data_in_and_out'),
      name: 'data_in_and_out',
      meta: { title: '路由登记', roles: ['data_resource_manage'] }
    },
    {
      path: 'net_product',
      component: () => import('@/views/cainiao/net_product'),
      name: 'net_product',
      meta: { title: '网络分配', roles: ['net_product'] }
    },
    {
      path: 'net_white_list',
      component: () => import('@/views/cainiao/net_white_list'),
      name: 'net_white_list',
      meta: { title: '网络白名单', roles: ['net_product'] }
    },
    {
      path: 'index3',
      component: () => import('@/views/permission/index'),
      name: 'cainiao',
      meta: { title: '菜鸟信息', roles: ['cainiao'] },
      children: [
        {
          path: 'statistics_cainiao',
          component: () => import('@/views/cainiao/statistics_cainiao'),
          name: 'statistics_cainiao',
          // hidden: 'true',
          meta: { title: '信息统计' }
        },
        EcsRouter,
        VpcRouter,
        {
          path: 'rds',
          component: () => import('@/views/cainiao/rds'),
          name: 'rds',
          // hidden: 'true',
          meta: { title: '云数据库RDS' },
          roles: ['cainiao']
        },
        {
          path: 'redis',
          component: () => import('@/views/cainiao/redis'),
          name: 'redis',
          // hidden: 'true',
          meta: { title: '云数据库Redis' },
          roles: ['cainiao']
        },
        {
          path: 'slb',
          component: () => import('@/views/cainiao/slb'),
          name: 'slb',
          // hidden: 'true',
          meta: { title: '负载均衡SLB' },
          roles: ['cainiao']
        },
        {
          path: 'oss',
          component: () => import('@/views/cainiao/oss'),
          name: 'oss',
          // hidden: 'true',
          meta: { title: '对象存储OSS' },
          roles: ['cainiao']
        }
      ]
    }
  ]

}

export default cainiaoRouter
