const state = {
  visitedViews: [],
  cachedViews: ['midmonitorroot', 'zabbix'],
  childRoutesNames: []
}

const mutations = {
  SET_CHILD_ROUTES_NAME: (state, names) => {
    state.childRoutesNames = names
  },
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        sessionStorage.removeItem(view.fullPath.replace(/\//g, '_'))
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews.splice(index, 1)
        break
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      if (v.path !== view.path) sessionStorage.removeItem(v.fullPath.replace(/\//g, '_'))
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews = state.cachedViews.slice(index, index + 1)
        break
      }
    }
  },

  DEL_RIGHT_VISITED_VIEWS: (state, view) => {
    const index = state.visitedViews.indexOf(view)
    const delViews = state.visitedViews.slice(index + 1,)
    delViews.map(view => sessionStorage.removeItem(view.fullPath.replace(/\//g, '_')))
    state.visitedViews = state.visitedViews.slice(0, index + 1)
  },
  DEL_RIGHT_CACHED_VIEWS: (state, view) => {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews = state.cachedViews.slice(0, index + 1)
        break
      }
    }
  },

  DEL_LEFT_VISITED_VIEWS: (state, view) => {
    const index = state.visitedViews.indexOf(view)
    const delViews = state.visitedViews.slice(0, index + 1)
    delViews.map(view => sessionStorage.removeItem(view.fullPath.replace(/\//g, '_')))
    state.visitedViews = view.name === 'Dashboard' ? state.visitedViews.slice(index,) : [state.visitedViews[0], ...state.visitedViews.slice(index,)]
  },
  DEL_LEFT_CACHED_VIEWS: (state, view) => {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews = view.name === 'Dashboard' ? state.cachedViews.slice(index,) : [state.cachedViews[0], ...state.cachedViews.slice(index,)]
        break
      }
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => {
      sessionStorage.removeItem(tag.fullPath.replace(/\//g, '_'))
      return tag.meta.affix
    })
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delRightViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delRightVisitedViews', view)
      dispatch('delRightCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delRightVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delRightCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delLeftViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delLeftVisitedViews', view)
      dispatch('delLeftCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delLeftVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_LEFT_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delLeftCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_LEFT_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
