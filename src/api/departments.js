import request from '@/utils/request'

/**
 * 获取部门列表
 * @returns 部门列表
 */
export function getDepartments() {
  return request({
    url: '/company/department', 
    method: 'GET'
  })
}

/**
 * 添加部门
 * @returns 添加的结果
 */
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

/**
 * 根据ID查询部门详情
 * @param  id
 * @returns 部门详情
 */
export function getDepartmentById(id) {
  return request({

    // 也可以这样写， 注意，一定得有空格，不然错
    // / company/department/ + id

    url: `/company/department/${id}`,
    method: 'GET'
  })
}

/**
 * 根据ID修改部门详情
 * @param  id
 * @returns 修改后的部门详情
 */
//    因为请求参数需要body，所以需要 data,但因为非必须，所以只传我们的 form 即可
export function updataDepartment(data) {
  return request({
    url: '/company/department/' + data.id,
    method: 'PUT',
    data
  })
}

/**
 * @description: 删除部门
 * @param {*} id 当前点击的操作按钮 所在的项的id
 * @return {*}
 */
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

