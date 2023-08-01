import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// style 的入口文件
import '@/styles/index.scss' // global css

// api 文件使用用来给其它 组件调用的

import App from './App'
// 放了所有的状态 js 文件
import store from './store'
// router 中放置了所有的页面组件
import router from './router'

import '@/icons' // icon
// 权限控制, 只执行模块内的代码，不需要引入其中的成员，向引入css那样
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
 
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 测试访问环境变量
// 这个环境变量是 node 提供, 所以修改完环境变量后一定要重启服务器
// console.log(process.env.VUE_APP_NAME)
// console.log(process.env.VUE_APP_BASE_API)
