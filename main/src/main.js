import Vue from 'vue'

import Cookies from 'js-cookie'
import JsEncrypt from 'jsencrypt'
import utils from './utils/utils'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

// import VueClipboard from 'vue-clipboard2'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import elCascaderMulti from 'el-cascader-multi' // el-cascader multiple
import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(elCascaderMulti)
// Vue.use(VueClipboard)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$jsEncrypt = JsEncrypt
Vue.prototype.$utils = utils

new Vue({
  el: '#YTXC',
  router,
  store,
  render: h => h(App)
})
