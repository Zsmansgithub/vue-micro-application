import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { loginDD } from '@/api/user'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/redirect', '/authjwt', '/logout', '/401', '/zhibanhtml', '/workflow_h5list', '/dd_web_mian_deng_page'] // no redirect whitelist

let allFullpaths

router.beforeEach(async(to, from, next) => {
  try {
    // start progress bar
    NProgress.start()
    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        // determine whether the user has obtained his permission roles through getInfo
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          if (!allFullpaths) { allFullpaths = store.getters.allFullpaths || [] }
          let { fullPath } = to
          fullPath = fullPath.indexOf('?') ? fullPath.split('?')[0] : fullPath
          if (allFullpaths.includes(fullPath)) {
            next()
          } else if (whiteList.includes(fullPath)) {
            if (!to.name) {
              to.name = to.path.slice(1,)
            }
            next()
          } else {
            next({ path: '/404' })
          }
        } else {
          try {
            // get user info
            // dynamically add accessible routes

            const { menu } = await store.dispatch('user/getInfo')
            store.dispatch('permission/generateRoutes', menu)
            const rmenu = menu.reduce((list, i) => {
              if (!(i.meta && i.meta.basePath)) {
                list.push(i)
              } else {
                const path = `/${i.meta.basePath.replace('/', '')}/*`
                if (!list.some((i) => { return i.path === path })) {
                  list.push(
                    {
                      path: `/${i.meta.basePath.replace('/', '')}/*`,
                      component: () => import('@/layout/subproject'),
                      hidden: true,
                      meta: i.meta
                    },
                  )
                }
              }
              return list
            }, [])
            router.addRoutes(rmenu)

            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (error) {
            // remove token and go to login page to re-login
            console.error(error)
            await store.dispatch('user/resetToken')
            // Message.error(error || 'Has Error')
            next(`/login`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        if (!to.name) {
          to.name = to.path.slice(1,)
        }
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        if (window.location.search.substring(1).indexOf('code') !== -1) {
          loginDD(window.location.search.substring(1)).then(response => {
            const { data } = response
            store.dispatch('user/loginjwt', data).then(() => {
              next({ path: '/' })
            })
          })
            .catch((err) => {
              console.error(err)
              next(`/login`)
              NProgress.done()
            })
        } else if (window.location.search.substring(1).indexOf('id_token') !== -1) {
          next(`/authjwt?redirect_url=${to.path}`)
        } else {
          next(`/login?redirect=${to.path}`)
        }
        NProgress.done()
      }
    }
  } catch (err) {
    console.error(err)
    location.href = '/'
  }
})

router.afterEach((to, from, next) => {
  // finish progress bar
  const visitedViews = store.getters.visitedViews

  if (visitedViews && visitedViews.length && !visitedViews.find((val) => val.fullPath === from.fullPath)) sessionStorage.removeItem(from.fullPath.replace(/\//g, '_'))
  NProgress.done()
})
