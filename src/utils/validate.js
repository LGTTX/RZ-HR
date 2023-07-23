/**
 * Created by JWL on 2023/7/20.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// /**
//  * @param {string} str
//  * @returns {Boolean}
//  */

// // 按需导出
// export function validUsername(str) {
//   const valid_map = ['admin', 'editor']
//   return valid_map.indexOf(str.trim()) >= 0
// }

// array.indexOf(item,start)
// item	必须。查找的元素。
// start	可选的整数参数。规定在数组中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。
/**
 * @param {string} str 手机号
 * @returns {Boolean} 校验结果
 */
export function validMobile(str) {
  // return 布尔值, 手机号的校验结果
  // test: 检索字符串中指定的值。返回 true 或 false。
  return /^1[3-9]\d{9}$/.test(str)
}
