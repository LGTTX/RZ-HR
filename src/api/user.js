import request from '@/utils/request'

// 接口封装
/**
 * 登录 API
 * @param {Object} data 登录表单
 * @returns 登录结果 Promise 对象
 */
// 指定配置
export function login(data) {
  // 同等于:  axios({method, url,data})
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

export function getInfo(table) {

}

export function logout() {

}

/**
 * 
 * @returns dataDome
 */
// 1.封装一个测试接收 token 的方法
export function getProfile() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// export default {
//   namespaced: true,
//   state: {},
//   mutations: {},
//   actions: {}
// }
