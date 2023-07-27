// 注册全局前置导航守卫
// 回调函教有3个参数
// 参数1: to 到哪里去
// 参数2: from 从哪里来参数
// 参数3: next 是否放行
// 注意事项:导航守卫一定要调用 next, 因为 next 代表着是否放行
// to.path: to是一个路由对象，path表示路径，是它的一个属性
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from './utils/get-page-title'

// 定义白名单
const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  // 
  // console.log(to.path, from.path)

  // 3-1.进度条开始
  NProgress.start()
  // token 存在 vuex 中, 所以需要导入 store, 取 token,
  const token = store.state.user.token
  // console.log(token)
  // 权限控制兵分两路:
  // 1.有token的情况
  // 判断是否去登录页，如果是就强行跳转到首页，如果不是就放行
  // 2．无 token 的情况
  // 判断是否去登录页，如果是就放行，如果不是就强行跳转到登录页
  if (token) { // 有 token
    // 5.将获取用户信息放在这, 先判断已经成功登录(因为跳转再登录的后面),然后再获取用户信息
    // 5-1.此处必须要加 await,
    // 不加的话，很有可能下面的代码都执行了，我这里还没执行完（如网速慢一点时），影响用户体验
    // 因为不加的话，场景如: 因为网速慢，在用户退出时会出现闪一下，会看到首页在退出到登录页
    // --》这个操作就是  直到我获取完用户信息了操作完了才能继续下去，否则一直等下去
    
    // 5-2.---》 此处是在全局前置守卫导航里面发的请求
    // 必须拿到用户信息后才可以进入首页,否则不进去
    // 可以避免山现 token 过期后依然进入首页闪回登录页（一般是退出直接退回登录页，不经过首页），优化用户休验
    // 进入首页后一定可以拿到用户信息

    // --》 奥秘就是 请求的地方在 前置导航守卫这里

    // 对于为什么 在这样一个块里面，如果此处的异步获取不到消息它就会一直卡在这里，
    // ---》因为在 async/await 里面，在这里面的都是 异步任务

    // 6. 加一个判断，如果有 userId 了, 就不需要发请求了，如果没有 userId 才发请求
    // 6-1. 获取 userId
    // const userId = store.state.user.userInfo.userId
    // 在 gettre 定义后, 来拿
    // 6-2. 如果没有 userId 才发请求 , 因为有 userId 则已经是存在 userProfile 了
    const userId = store.getters.userId
    if (!userId) {
      await store.dispatch('user/postProfile')
    }
    if (to.path === '/login') { // 去登录页
      // 4.如果已经登录了，从首页访问登录页，则不会进行路由跳转，从首页到首页不算路由跳转
      // 会导致后置守卫不触发的情况
      next('/') // 跳转到首页
      // 4-1.所以我们调用到这也可
      NProgress.done()
    } else {
      next() // 放行，即默认跳转到本次 to.path 页面
    }
  } else { // 无 token
    // 当未登录时,要判断是否去白名单页面
    // 白名单:未登录时也可以访问的页面,例如登录注册484
    // 如果用逻辑或来写，将来可维护性不高
    // if (to.path === " / login' ll to.path === "/404") {
    // indexof 用于返回数组中某个指定的元素位置。
    // if (whiteList.indexof(to.path) > -1){ //不好用，还要记返回值
    // includes  判断指定的值是否在数组中，返回值是 boolean
    // console.log('no token')
    if (whiteList.includes(to.path)) {
      // console.log('no token')
      next() // 放行，即默认跳转到本次 to.path 页面
    } else {
      next('/login')
      // 4-2. 在 4-1 处理了，这里也处理一下
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  // 7. 打印一下 to, from
  /* 
    // $router 做编程式导航跳转的
    // to from 这些都是 $route 路由信息对象

    在 Vue 实例中，你可以通过 $router 访问路由实例。因此你可以调用 this.$router.push。
  */
  // 7-1. 打印之后 在 to 信息对象里面有 meta 属性，这就好办了，直接拿
  // console.log(to, from)
  // 7-2. 直接 通过 to 拿 meta
  // document.title = `人资系统 - ${to.meta.title}`
  document.title = getPageTitle(to.meta.title)

  // 3-2.进度条结束
  NProgress.done()
})

// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           // await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
