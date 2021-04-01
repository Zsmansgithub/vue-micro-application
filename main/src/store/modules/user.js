import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
const state = {
  token: getToken(),
  name: '',
  uuid: '',
  avatar: '',
  introduction: '',
  roles: [],
  menu: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login 2
  loginjwt({ commit }, idToken) {
    const idtoken = idToken
    return new Promise((resolve, reject) => {
      const data = idtoken
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      resolve()
    }).catch(error => {
      // reject(error)
      console.error(error)
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('请求失败，请重新登录')
        }
        const { roles, name, uuid, avatar, introduction } = data
        let { menu } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles 必须是一个非空数组!')
        }
        if (!menu || menu.length <= 0) {
          reject('getInfo: menu 必须是非空数组!')
        }
        let xcRoutesName = []
        const fn = function f(items, path) {
          return items.sort((a, b) => { return a.meta.sort - b.meta.sort })
            .reduce((list, item) => {
              if (path === '/') {
                path = ''
              }
              const component = item.component.slice(-4,) === '.vue' ? item.component.slice(0, -4) : item.component
              item.component = (resolve) => require([`@/${component}.vue`], resolve)
              item.path = item.path.slice(0, 1) === '/' ? item.path.slice(1,) : item.path
              const pathSelf = `${path}/${item.path}`
              xcRoutesName.push(pathSelf)
              item.meta.title = item.title
              item.meta.icon = item.icon
              item.title = undefined
              item.icon = undefined
              if (item.children && item.children.length > 0) item.children = f(item.children, pathSelf)
              list.push(item)
              return list
            }, [])
        }
        const childRoutesName = []
        const fnc = function f(items, path) {
          return items.sort((a, b) => { return a.meta.sort - b.meta.sort })
            .reduce((list, item) => {
              if (!path) {
                path = '/' + item.meta.basePath
              }
              item.path = item.path.slice(0, 1) === '/' ? item.path.slice(1,) : item.path
              const pathSelf = `${path}/${item.path}`
              childRoutesName.push({ fullPath: pathSelf, title: item.title })
              item.meta.title = item.title
              item.meta.icon = item.icon
              item.title = undefined
              item.icon = undefined
              if (item.children && item.children.length > 0) item.children = f(item.children, pathSelf)
              list.push(item)
              return list
            }, [])
        }
        const menuXC = fn(menu.filter((item) => !(item.meta && item.meta.basePath)), '')
        const menuC = fnc(menu.filter((item) => (item.meta && item.meta.basePath)))
        menu = [...menuXC, ...menuC]
        menu.sort((a, b) => { return a.meta.sort * 1 - b.meta.sort * 1 }).map((item) => {
          item.path = item.path.slice(0, 1) === '/' ? item.path : `/${item.path}`
        })

        data.menu = menu
        const cfullPath = childRoutesName.map(r => r.fullPath)
        xcRoutesName = xcRoutesName.concat(cfullPath)
        commit('tagsView/SET_CHILD_ROUTES_NAME', childRoutesName, { root: true })
        commit('permission/SET_ALL_ROUTES', xcRoutesName, { root: true })
        commit('SET_ROLES', roles)
        commit('SET_ROLES', roles)
        commit('SET_MENU', menu)
        commit('SET_NAME', name)
        commit('SET_UUID', uuid)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
