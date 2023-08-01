import Layout from '@/layout'
export default {
  // 1-1.一级路由 + 加载组件
  path: '/departments',
  component: Layout,
  children: [{
    // 如果子路由的 path 设置为空字符串表示该路由的默认路由
    // 1-2.二级路由(默认路径为一级路径) + 加载组件
    path: '', //  /departments/
    name: 'Departments',
    component: () => import('@/views/departments/departments.vue'),
    meta: { title: '组织架构', icon: 'tree' }
  }]
}
