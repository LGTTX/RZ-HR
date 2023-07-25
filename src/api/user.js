import request from '@/utils/request'

// 接口封装
/**
 * 登录 API
 * @param {Object} data 登录表单
 * @returns 登录结果 Promise 对象
 */
// 1.获取登录信息
// 指定配置
export function login(data) {
  // 同等于:  axios({method, url,data})
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
/**
 * 获取 用户基本资料
 * @param id
 * @returns 用户信息
 */
// 2.获取用户基本资料
// 对于 getProfile 来说，其它请求参数已经配好了
export function getProfile() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取 员工基本信息
 * @returns 员工基本信息
 * return
 */
// 3.获取员工基本信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`, // 使用模板字符串也可
    method: 'GET'
  })
}

export function logout() {

}

/**
 * 
 * @returns dataDome
 */
// 1.封装一个测试接收 token 的方法
// export function getProfile() {
//   return request({
//     url: '/sys/profile',
//     method: 'POST'
//   })
// }

// export default {
//   namespaced: true,
//   state: {},
//   mutations: {},
//   actions: {}
// }
