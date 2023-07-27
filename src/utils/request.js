//  request 文件，是把所有的 axios 的全局操作都放到 request 这个文件
//  导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
// 引入 store
import store from '@/store'
import router from '@/router'
// import Vue from 'vue'
// 创建一个axios的实例，配置
const service = axios.create({
  // 当没有设置服务器地址时，请求的就是当前服务器
  // http://localhost:9528是绝对路径
  // baseURL: 'http://localhost:9528'

  // baseURL: '/api',
  // 最终还是要环境变量
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: 'http://ihrm.itheima.net/api',

  // 请求超时的等待时间
  timeout: 5000 // request timeout
})

// 2.添加请求拦截器
// 此处 axios 要改为 service
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  // 2-1.将 vuex 中的 token 携带到 请求头中
  // --》this 只能在组件中使用，不可在 js 文件中使用，这就是原因
  // 获取 vuex 中 token (所以得引入 store),引入后为全局 store
  const token = store.state.user.token 
  // 2-1-1.一接口文档知， 需要在 Header（请求头） 添加参数名 Authorization
  // token 前面还有 Bearer 
  // 2-2.先判断是否有 token,因为现在要加上一个 Bearer，没 token 说明没登录，那就不带 Bearer 了，就不管它了
  if (token) {
    // 接口要求，Bearer 后面要加空格
    // 对象的两种访间属性的方法
    // [] 里面可以写变量
    // config.headers['Authorization']
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 1.添加响应拦截器
// 1-1.注意,此处 axios 要改为 service, 因为导出的是 service 
service.interceptors.response.use(function(response) {
  // console.log('响应结果拦截到了:', response)
  if (response.data.success) {
    // 数据脱壳
    return response.data
  } else {
    // 对响应数据做点什么
    // 服务器响应错误的时候,但此时axios不会报错
    // 手动报错!
    // axios基于promise封装
    // new Error 作用:抛出错误! 当代码运行时的发生错误，会创建新的 Error 对象，并将其抛出。
    return Promise.reject(new Error(response.data.message))
  }
}, function(error) {
  // 2.对 token 失效进行处理
  // console.log('响应错误拦截到了:', error)
  // 2-1. 想要看具体点的 dir
  // console.dir(error)
  // 2-2. 通过打知, 1002 token 就过期了（模拟，修改 token 值就行）
  if (error.response.data.code === 10002) {
    // 2-3.token 失效, 则清空 token 和 userInfo
    store.dispatch('user/logout')
    // 3. 最后提示一下吧
    // Vue.prototype.$message.error('用户信息出错,请重新登录')

    // console.log(location)
    // console.log(location.hash)

    // 2-4. 跳转到登录页面, 当前在什么页面,登录后还得跳回来
    // 这时就用到 路由传参的知识点了（在加编程式导航更好）
    // 最后，导入 router,因为这是 js，再看看 导出是不是 router
    // console.log('req1:', router)
    // console.log('req2:', router.currentRoute.fullPath)   //  '/'
    // router.currentRoute:获取当前的路由信息，完全等同于 $route
    // currentRoute 跳回登录页之前，把当前消息带回登录页
    router.push({
      path: '/login',
      query: {
        // 利用 BOM 的 API, 直接获取地址栏的hash即可
        // 再利用 substring 去掉 #
        // return_url: router.currentRoute.fullPath // 路由会帮我们转码,无需手动处理
        return_url: location.hash.substring(1)
      }
    })
    // router.push('/login?return_url=' + encodeURIComponent(router.currentRoute.fullPath))
  }

  // 对响应错误做点什么
  return Promise.reject(error)
})

export default service // 导出axios实例

// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
// 创建一个 axios 实例对象
// 传入配置对象
// const service = axios.create({
//   // 基地址
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   // 请求超时的等待时间（最多等待这么多时间）
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service
