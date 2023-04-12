import Vue from 'vue'

const hsz = require('./utils/hsz').default

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import './assets/scss/common.scss'

import '@/styles/index.scss' // global css
import './assets/scss/theme.scss' // 主题

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './permission' // permission control
import './utils/error-log' // error log
import { message } from './utils/message';

import * as filters from './filters' // global filters

// 自定义按钮权限指令
import permission from "@/directive/permission";
Vue.use(permission)

Vue.use(Element, {
  size: hsz.storageGet('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// 批量引入组件
import components from './components'
Vue.use(components)

// 引入展示json组件
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)

// 添加实例属性
Object.assign(Vue.prototype, {
  define: require('./utils/define'), // 常量
  hsz, // 公共方法
  formValidate: require('./utils/formValidate').default, // 表单验证
  $message: message
})

// 全局注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
export default vm