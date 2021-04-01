import Vue from 'vue'
import Router from 'vue-router'
import { routeGuard } from "@/permission"

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
]
const createRouter = (appName, propRoutes = []) => {
  let addRoutes
  try {
    const fn = (items) => {
      return items.sort((a, b) => { return a.meta.sort - b.meta.sort })
        .reduce((list, item) => {
          const component = item.component.slice(-4,) === '.vue' ? item.component.slice(0, -4) : item.component
          item.component = (resolve) => require([`@/${component}.vue`], resolve)
          item.path = item.path.slice(0, 1) === '/' ? item.path.slice(1,) : item.path
          item.meta.title = item.title
          item.meta.icon = item.icon
          item.title = undefined
          item.icon = undefined
          if (item.children && item.children.length > 0) item.children = fn(item.children)
          list.push(item)
          return list
        }, [])
    }
    addRoutes = fn(propRoutes)
    addRoutes.forEach((item) => {
      item.path = item.path.slice(0, 1) === '/' ? item.path : `/${item.path}`
    })
  } catch (e) {
    addRoutes = []
    console.error(e)
  }
  let router = new Router({
    base: window.__POWERED_BY_QIANKUN__ ? `/${appName}/` : '/',
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes.concat(addRoutes)
  })
  const router1 = routeGuard(router)
  return router1
}

// const router = createRouter()

// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher
// }

export default createRouter
