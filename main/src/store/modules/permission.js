import { constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: [],
  allFullpaths: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ALL_ROUTES: (state, paths) => {
    state.allFullpaths = paths
  }
}

const actions = {
  generateRoutes({ commit }, menu) {
    commit('SET_ROUTES', menu)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
