
import './public-path';
import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import createRouter from './router'

import './icons' // icon

import elCascaderMulti from 'el-cascader-multi' // el-cascader multiple
import * as filters from './filters' // global filters
import { setToken } from '@/utils/auth'
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(elCascaderMulti)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

let router = null;
let instance = null;
function render(props = {}) {
  const { container, token, name, userName, uuid } = props;
  setToken(token)
  let roles, menu
  try {
    roles = JSON.parse(props.roles)
    menu = JSON.parse(props.menu)
  } catch (e) {
    roles = []
    menu = []
    console.error(e)
  }
  store.commit('user/SET_USERINFO', { appName: name, userName, uuid })
  store.commit('user/SET_ROLES', roles)
  store.commit('user/SET_MENU', menu)
  router = createRouter(name, menu);
  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
}
export async function mount(props) {
  // console.log('demo1 mount')
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
