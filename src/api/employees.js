import request from '@/utils/request'

/**
 * 获取员工简单列表
 * @returns 员工简单列表
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}
 
/**
 * 获取员工列表
 * @param {*} data 
 * @returns 员工列表
 */
export function getEmployees(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
