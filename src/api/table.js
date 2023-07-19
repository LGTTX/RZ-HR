// 细节: 我们在 request 导出的是 service, 而在这导入的是 request
// ---》 service 是一个对象，此处的 request 相当于给 service 起一个变量名

// 单行注释
/* 多行注释 */
/** 文档注释 */

/**
 * 这是获取表格数据的 API
 * @param {*} param
 * @returns 一个 promise 对象
 */

import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
