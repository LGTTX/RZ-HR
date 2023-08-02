//  component 公共组件的导入口
import PageTools from './PageTools'
export default {
  // 将 PageTools组件的注册交给install函数帮忙完成
  install(Vue) { // 此处的 Vue 就是 形参
    // 对象的全等比较比较数据类型地址值
    // console.log(‘我是插件,我执行了，x === vue)  // true

    // 全局注册PageTools
    // Vue.component('PageTools', PageTools)
    Vue.component(PageTools.name, PageTools)
    
    // 还可以在vue的原型上挂成员
    // 这就是封装张的好处
  }
}
