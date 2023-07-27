import Layout from '@/layout'

export default {
  // 1-1.一级路由 + 加载组件
  path: '/employees',
  component: Layout,
  children: [{
    path: '',
    name: 'Employees',
    component: () => import('@/views/employees/employees.vue'),
    meta: { title: '员工', icon: 'people' }
  }]
}
