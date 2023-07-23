import { setToken, getToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// Element 为 Vue.prototype 添加了全局方法 $message。
// 也可 导入 Vue 也可
// import { Message } from 'element-ui'
// import Vue from 'vue'
export default { 
  namespaced: true,
  // namespaced: true,
  state: {
    // 1. 如果拿到 token 就 getToken, 没拿到 token 则 ''
    // 首次加载在 cookie 中取值
    // token 是从本地来的,本地没有就为 ''
    token: getToken() || ''
    // token: ''
  },
  mutations: {
    // 1.定义 mutations 来操作 token
    updataToken(state, token) {
      state.token = token

      // 1-1.存到本地 cookie 中
      setToken(token)
    },
    // 2.删除 token
    removeToken(state) {
      state.token = ''
      // 2-1.删除 cookie 中的
      removeToken()
    }
  },
  actions: {
    async postLogin(context, loginForm) {
    // 1.在 user 中是不会有 this.loginForm 的
    // const res = await login(this.loginForm) 
    // 1-1.采用传参方式
    // 1-2 一般捕获 try..catch 还是放到组件中吧，虽然放在这也行
      // try {
      const res = await login(loginForm) 
      // 2.contenx.commit('user/updataToken', res.data)
      // 在 vuex 的 user 里是不需要 user/
      // 将 token 交给 mutation 存入 state 
      context.commit('updataToken', res.data)
      // } catch (event) {
      //   Vue.prototype.$message.error(event.message)
      // }
    }
  }
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

