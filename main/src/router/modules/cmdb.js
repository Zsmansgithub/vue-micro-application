/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const cmdbRouter = {
  path: '/cmdb',
  component: Layout,
  redirect: 'noRedirect',
  name: 'cmdbconfig',
  meta: {
    title: 'CMDB',
    icon: 'component',
    roles: ['cmdb', 'cmdb_project', 'cmdb_admin']
  },
  children: [
    {
      path: 'server',
      component: () => import('@/views/cmdb/server'),
      name: 'ServerList',
      meta: { title: '虚机查询', roles: ['cmdb'] }
    }, {
      path: 'resoucre',
      component: () => import('@/views/cmdb/resourcemanage'),
      name: 'ResourceManage',
      meta: { title: '资源管理', roles: ['cmdb'] }
    }, {
      path: 'account_manage2',
      component: () => import('@/views/cmdb/account-manage2'),
      name: 'account_manage2',
      meta: { title: '密码查询', roles: ['cmdb'] }
    }, {
      path: 'base_config_route',
      component: () => import('@/views/permission/index'),
      name: 'user_config',
      redirect: 'noRedirect',
      meta: { title: '基础配置', roles: ['host_manager', 'pwd_manager'] },
      children: [
        {
          path: 'machine',
          component: () => import('@/views/cmdb/machine'),
          name: 'machineconfig',
          meta: { title: '机房管理', roles: ['host_manager'] }
        },
        {
          path: 'supplierManage',
          component: () => import('@/views/cmdb/supplier-manage'),
          name: 'suppliermanage',
          meta: { title: '维保商管理', roles: ['host_manager'] }
        },
        {
          path: 'app_permission',
          component: () => import('@/views/cmdb/app-permission'),
          name: 'AppPermission',
          meta: { title: '应用权限管理', roles: ['host_manager'] }
        },
        {
          path: 'account_manage',
          component: () => import('@/views/cmdb/account-manage'),
          name: 'account_manage',
          meta: { title: '账号密码管理', roles: ['host_manager', 'pwd_manager'] }
        }, {
          path: 'v_center',
          component: () => import('@/views/cmdb/v_center'),
          name: 'v_center',
          meta: { title: 'VCenter集群', roles: ['pwd_manager'] }
        },
        {
          path: 'v_center_host',
          component: () => import('@/views/cmdb/v_center_host'),
          name: 'v_center_host',
          meta: { title: '宿主机查询', roles: ['host_manager', 'pwd_manager'] }
        }, {
          path: 'infrastructure',
          component: () => import('@/views/cmdb/infrastructure'),
          name: 'Infrastructure',
          meta: { title: '基础设施', roles: ['host_manager'] }
        }, {
          path: 'bastion_host',
          component: () => import('@/views/cmdb/bastion_host'),
          name: 'BastionHost',
          meta: { title: '堡垒机管理', roles: ['host_manager'] }
        }, {
          path: 'statistics_dashboard',
          component: () => import('@/views/cmdb/statistics_dashboard'),
          name: 'statistics_dashboard',
          meta: { title: '报表统计', roles: ['host_manager'] }
        }, {
          path: 'comprehensive_query',
          component: () => import('@/views/cmdb/comprehensive_query'),
          name: 'comprehensive_query',
          // hidden: true,
          meta: { title: '综合查询', roles: ['host_manager'] }
        }]
    },
    {
      path: 'index1_app',
      component: () => import('@/views/permission/index'),
      name: 'app_router_config',
      redirect: 'noRedirect',
      meta: { title: '应用配置', roles: ['cmdb_admin', 'cmdb_project', 'cmdb_db'] },
      children: [{
        path: 'product_line',
        component: () => import('@/views/cmdb/product_line'),
        name: 'product_line',
        meta: { title: '产品线管理', roles: ['cmdb_admin'] }
      }, {
        path: 'app',
        component: () => import('@/views/cmdb/app'),
        name: 'appconfig',
        meta: { title: '应用管理', roles: ['cmdb_admin'] }
      }, {
        path: 'pool',
        component: () => import('@/views/cmdb/pool-config'),
        name: 'poolconfig',
        meta: { title: '项目管理', roles: ['cmdb_project'] }
      },
      // {
      //   path: 'db',
      //   component: () => import('@/views/cmdb/db-manage'),
      //   name: 'dbmanage',
      //   meta: { title: '数据库管理', roles: ['cmdb_db'] }
      // },
      {
        path: 'db_cluster',
        component: () => import('@/views/zabbix/db_cluster'),
        name: 'db_cluster',
        // hidden: true,
        meta: { title: 'DB集群配置管理', roles: ['cmdb_db'] }
      }, {
        path: 'mysql',
        component: () => import('@/views/db/mysql_apply'),
        name: 'mysqlapply',
        hidden: true,
        meta: { title: '数据库用户管理', roles: ['cmdb_db'] }
      }, {
        path: 'deploy_conf',
        component: () => import('@/views/cmdb/deploy_conf'),
        name: 'deploy_conf',
        meta: { title: '发布管理', roles: ['cmdb_admin'] }
      }, {
        path: 'multi_app_conf',
        component: () => import('@/views/cmdb/multi_app_conf'),
        name: 'multi_app_conf',
        meta: { title: '多应用管理', roles: ['cmdb'] }
      }]
    }
  ]
}

export default cmdbRouter
