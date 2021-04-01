/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const workflowRouter = {
  path: '/workflow',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true,
  name: 'workflow',
  meta: {
    title: '工单管理',
    icon: 'form'
    // roles: ['workflow', 'malfunction', 'malfunction_admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'app_manage',
      component: () => import('@/views/workflow/app_manage'),
      name: 'app_manage',
      meta: { title: '新建申请单' }
    }, {
      path: 'workflow_list',
      component: () => import('@/views/workflow/workflow_approval'),
      name: 'workflowApproval',
      meta: { title: '申请单管理' }
    },
    {
      path: 'database_access_application',
      component: () => import('@/views/workflow/database_access_application'),
      name: 'database_access_application',
      hidden: true,
      meta: { title: '数据库接入申请单' }
    },
    {
      path: 'database_access_application_detail',
      component: () => import('@/views/workflow/database_access_application_detail'),
      name: 'database_access_application_detail',
      hidden: true,
      meta: { title: '数据库接入申请单详情' }
    },
    {
      path: 'app_apply',
      component: () => import('@/views/workflow/app_apply'),
      name: 'app_apply',
      hidden: true,
      meta: { title: '新应用申请单' }
    },
    {
      path: 'app_apply_detail',
      component: () => import('@/views/workflow/app_apply_detail'),
      name: 'app_apply_detail',
      hidden: true,
      meta: { title: '新应用申请单详情' }
    },
    {
      path: 'uatsit_apply',
      component: () => import('@/views/workflow/uatsit_apply'),
      name: 'uatsit_apply',
      hidden: true,
      meta: { title: 'UAT/SIT申请单' }
    },
    {
      path: 'uatsit_apply_detail',
      component: () => import('@/views/workflow/uatsit_apply_detail'),
      name: 'uatsit_apply_detail',
      hidden: true,
      meta: { title: 'UAT/SIT申请单详情' }
    },
    {
      path: 'app_apply_type',
      component: () => import('@/views/workflow/app_apply_type'),
      name: 'app_apply_type',
      meta: { title: '申请单后台管理', roles: ['admin'] }
    },
    {
      path: 'app_expansion_apply',
      component: () => import('@/views/workflow/app_expansion_apply'),
      name: 'app_expansion_apply',
      hidden: true,
      meta: { title: '虚拟机申请单' }
    },
    {
      path: 'app_expansion_apply_detail',
      component: () => import('@/views/workflow/app_expansion_apply_detail'),
      name: 'app_expansion_apply_detail',
      hidden: true,
      meta: { title: '虚拟机申请单详情' }
    },
    {
      path: 'app_expansion_edit',
      component: () => import('@/views/workflow/app_expansion_edit'),
      name: 'app_expansion_edit',
      hidden: true,
      meta: { title: '虚拟机配置变更申请单' }
    },
    {
      path: 'app_expansion_edit_detail',
      component: () => import('@/views/workflow/app_expansion_edit_detail'),
      name: 'app_expansion_edit_detail',
      hidden: true,
      meta: { title: '虚拟机配置变更申请单详情' }
    },
    {
      path: 'app_expansion_offline',
      component: () => import('@/views/workflow/app_expansion_offline'),
      name: 'app_expansion_offline',
      hidden: true,
      meta: { title: '服务器下线申请单' }
    },
    {
      path: 'app_expansion_offline_detail',
      component: () => import('@/views/workflow/app_expansion_offline_detail'),
      name: 'app_expansion_offline_detail',
      hidden: true,
      meta: { title: '服务器下线申请单详情' }
    },
    {
      path: 'app_physical_apply',
      component: () => import('@/views/workflow/app_physical_apply'),
      name: 'app_physical_apply',
      hidden: true,
      meta: { title: '物理机申请单' }
    },
    {
      path: 'app_physical_apply_detail',
      component: () => import('@/views/workflow/app_physical_apply_detail'),
      name: 'app_physical_apply_detail',
      hidden: true,
      meta: { title: '物理机申请单详情' }
    },
    {
      path: 'app_physical_edit',
      component: () => import('@/views/workflow/app_physical_edit'),
      name: 'app_physical_edit',
      hidden: true,
      meta: { title: '物理机配置变更申请单' }
    },
    {
      path: 'app_physical_edit_detail',
      component: () => import('@/views/workflow/app_physical_edit_detail'),
      name: 'app_physical_edit_detail',
      hidden: true,
      meta: { title: '物理机配置变更申请单详情' }
    },
    {
      path: 'ElasticSearch',
      component: () => import('@/views/workflow/ElasticSearch'),
      name: 'ElasticSearch',
      hidden: true,
      meta: { title: 'ES申请单' }
    },
    {
      path: 'ElasticSearch_detail',
      component: () => import('@/views/workflow/ElasticSearch_detail'),
      name: 'ElasticSearch_detail',
      hidden: true,
      meta: { title: 'ES申请单详情' }
    },
    {
      path: 'RocketMq',
      component: () => import('@/views/workflow/RocketMq'),
      name: 'RocketMq',
      hidden: true,
      meta: { title: 'MQ申请单' }
    },
    {
      path: 'RocketMq_detail',
      component: () => import('@/views/workflow/RocketMq_detail'),
      name: 'RocketMq_detail',
      hidden: true,
      meta: { title: 'MQ申请单详情' }
    },
    {
      path: 'publicMQtopic',
      component: () => import('@/views/workflow/publicMQtopic'),
      name: 'publicMQtopic',
      hidden: true,
      meta: { title: '公共MQtopic申请单' }
    },
    {
      path: 'publicMQtopic_detail',
      component: () => import('@/views/workflow/publicMQtopic_detail'),
      name: 'publicMQtopic_detail',
      hidden: true,
      meta: { title: '公共MQtopic申请单详情' }
    },
    {
      path: 'Redis',
      component: () => import('@/views/workflow/Redis'),
      name: 'Redis',
      hidden: true,
      meta: { title: 'Redis申请单' }
    },
    {
      path: 'Redis_detail',
      component: () => import('@/views/workflow/Redis_detail'),
      name: 'Redis_detail',
      hidden: true,
      meta: { title: 'Redis申请单详情' }
    },
    {
      path: 'MongoDB',
      component: () => import('@/views/workflow/MongoDB'),
      name: 'MongoDB',
      hidden: true,
      meta: { title: 'MongoDB申请单' }
    },
    {
      path: 'MongoDB_detail',
      component: () => import('@/views/workflow/MongoDB_detail'),
      name: 'MongoDB_detail',
      hidden: true,
      meta: { title: 'MongoDB申请单详情' }
    },
    {
      path: 'visit_mysql_oracle',
      component: () => import('@/views/workflow/visit_mysql_oracle'),
      name: 'visit_mysql_oracle',
      hidden: true,
      meta: { title: 'mysql/oracle权限申请单' }
    },
    {
      path: 'visit_mysql_oracle_detail',
      component: () => import('@/views/workflow/visit_mysql_oracle_detail'),
      name: 'visit_mysql_oracle_detail',
      hidden: true,
      meta: { title: 'mysql/oracle权限申请单详情' }
    },
    {
      path: 'visit_mongodb',
      component: () => import('@/views/workflow/visit_mongodb'),
      name: 'visit_mongodb',
      hidden: true,
      meta: { title: 'mongoDB权限申请单' }
    },
    {
      path: 'visit_mongodb_detail',
      component: () => import('@/views/workflow/visit_mongodb_detail'),
      name: 'visit_mongodb_detail',
      hidden: true,
      meta: { title: 'mongoDB权限申请单详情' }
    },
    {
      path: 'visit_redis',
      component: () => import('@/views/workflow/visit_redis'),
      name: 'visit_redis',
      hidden: true,
      meta: { title: 'redis权限申请单' }
    },
    {
      path: 'visit_redis_detail',
      component: () => import('@/views/workflow/visit_redis_detail'),
      name: 'visit_redis_detail',
      hidden: true,
      meta: { title: 'redis权限申请单详情' }
    },
    // {
    //   path: 'mysql_apply',
    //   component: () => import('@/views/workflow/mysql_apply'),
    //   name: 'mysql_apply',
    //   hidden: true,
    //   meta: { title: 'mysql应用申请单' }
    // },
    {
      path: 'network_slb',
      component: () => import('@/views/workflow/network_slb'),
      name: 'network_slb',
      hidden: true,
      meta: { title: '内网负载均衡申请单' }
    },
    {
      path: 'network_slb_detail',
      component: () => import('@/views/workflow/network_slb_detail'),
      name: 'network_slb_detail',
      hidden: true,
      meta: { title: '内网负载均衡申请单详情' }
    },
    {
      path: 'network_work_slb',
      component: () => import('@/views/workflow/network_work_slb'),
      name: 'network_work_slb',
      hidden: true,
      meta: { title: '负载申请-办公网申请单' }
    },
    {
      path: 'network_work_slb_detail',
      component: () => import('@/views/workflow/network_work_slb_detail'),
      name: 'network_work_slb_detail',
      hidden: true,
      meta: { title: '负载申请-办公网申请单详情' }
    },
    // {
    //   path: 'network_DomainName',
    //   component: () => import('@/views/workflow/network_DomainName'),
    //   name: 'network_DomainName',
    //   hidden: true,
    //   meta: { title: '域名申请单' }
    // },
    {
      path: 'network_out',
      component: () => import('@/views/workflow/network_out'),
      name: 'network_out',
      hidden: true,
      meta: { title: '权限申请-出向申请单' }
    },
    {
      path: 'network_out_detail',
      component: () => import('@/views/workflow/network_out_detail'),
      name: 'network_out_detail',
      hidden: true,
      meta: { title: '权限申请-出向申请单详情' }
    },
    {
      path: 'network_in',
      component: () => import('@/views/workflow/network_in'),
      name: 'network_in',
      hidden: true,
      meta: { title: '权限申请-入向-无需负载申请单' }
    },
    {
      path: 'network_in_detail',
      component: () => import('@/views/workflow/network_in_detail'),
      name: 'network_in_detail',
      hidden: true,
      meta: { title: '权限申请-入向-无需负载申请单详情' }
    },
    {
      path: 'network_in_slb',
      component: () => import('@/views/workflow/network_in_slb'),
      name: 'network_in_slb',
      hidden: true,
      meta: { title: '外网负载均衡申请单' }
    },
    {
      path: 'network_in_slb_detail',
      component: () => import('@/views/workflow/network_in_slb_detail'),
      name: 'network_in_slb_detail',
      hidden: true,
      meta: { title: '外网负载均衡申请单详情' }
    },
    {
      path: 'network_in_firewall',
      component: () => import('@/views/workflow/network_in_firewall'),
      name: 'network_in_firewall',
      hidden: true,
      meta: { title: '内网防火墙申请单' }
    },
    {
      path: 'network_in_firewall_detail',
      component: () => import('@/views/workflow/network_in_firewall_detail'),
      name: 'network_in_firewall_detail',
      hidden: true,
      meta: { title: '内网防火墙申请单详情' }
    },
    {
      path: 'edit_apply',
      component: () => import('@/views/workflow/edit_apply'),
      name: 'edit_apply',
      hidden: true,
      meta: { title: '变更申请单' }
    },
    {
      path: 'edit_apply_detail',
      component: () => import('@/views/workflow/edit_apply_detail'),
      name: 'edit_apply_detail',
      hidden: true,
      meta: { title: '变更申请单详情' }
    },
    {
      path: 'implement_apply',
      component: () => import('@/views/workflow/implement_apply'),
      name: 'implement_apply',
      hidden: true,
      meta: { title: '实施申请单' }
    },
    {
      path: 'implement_apply_detail',
      component: () => import('@/views/workflow/implement_apply_detail'),
      name: 'implement_apply_detail',
      hidden: true,
      meta: { title: '实施申请单详情' }
    },
    {
      path: 'newtechnology',
      component: () => import('@/views/workflow/newtechnology'),
      name: 'newtechnology',
      hidden: true,
      meta: { title: '新技术引进申请单' }
    },
    {
      path: 'newtechnology_detail',
      component: () => import('@/views/workflow/newtechnology_detail'),
      name: 'newtechnology_detail',
      hidden: true,
      meta: { title: '新技术引进申请单详情' }
    },
    {
      path: 'malfunction_report',
      component: () => import('@/views/workflow/malfunction_report'),
      name: 'malfunction_report',
      hidden: true,
      meta: { title: '故障报告申请单' }
    },
    {
      path: 'malfunction_report_detail',
      component: () => import('@/views/workflow/malfunction_report_detail'),
      name: 'malfunction_report_detail',
      hidden: true,
      meta: { title: '故障报告申请单详情' }
    },
    {
      path: 'workflow_nodes',
      component: () => import('@/views/workflow/workflow_line_nodes'),
      name: 'workflow_nodes',
      meta: { title: '申请单节点控制', roles: ['admin'] }
    },
    {
      path: 'workflow_statistical',
      component: () => import('@/views/workflow/workflow_statistical'),
      name: 'workflow_statistical',
      meta: { title: '申请单统计', roles: ['admin'] }
    },
    {
      path: 'zhibantable',
      component: () => import('@/views/workflow/zhibantable'),
      name: 'zhibantable',
      meta: { title: '值班表', roles: ['admin', 'workflow_admin'] }
    },
    {
      path: 'workflow_log',
      component: () => import('@/views/workflow/workflow_log'),
      name: 'workflow_log',
      hidden: true,
      meta: { title: '申请单操作日志', roles: ['admin'] }
    },
    {
      path: 'malfunction_record',
      component: () => import('@/views/workflow/malfunction_record'),
      name: 'malfunction_record',
      meta: { title: '故障管理', roles: ['malfunction', 'malfunction_admin', 'malfunction_super_admin'] }
    },
    {
      path: 'malfunction_subdivision',
      component: () => import('@/views/workflow/malfunction_subdivision'),
      name: 'malfunction_subdivision',
      meta: { title: '故障分类管理', roles: ['malfunction_super_admin'] }
    },
    {
      path: 'malfunction_statistics',
      component: () => import('@/views/workflow/malfunction_statistics'),
      name: 'malfunction_statistics',
      meta: { title: '故障统计', roles: ['malfunction_super_admin'] }
    }
  ]
}

export default workflowRouter
