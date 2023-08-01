import request from '@/utils/request'

/**
 * 获取所有角色列表
 * @param {*} params 
 * @returns 角色列表
 */
export function getRolesList(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}
 
/**
 * 根据ID删除角色
 * @param {*} params 
 * @returns 角色信息
 */
export function delRoleById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
