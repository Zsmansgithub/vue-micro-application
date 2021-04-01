import { getToken } from '@/utils/auth'
import router from '@/router'
const state = {
  name: '',
  uuid: '',
  token: getToken(),
  roles: [],
  menu: [],
  appName: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.appName = userInfo.appName
    state.uuid = userInfo.uuid
    state.name = userInfo.userName
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  }
}

const actions = {
  setInfo({ commit, state }) {
    commit('SET_TOKEN', state.token)
    commit('SET_ROLES', state.roles)
    commit('SET_MENU', state.menu)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
