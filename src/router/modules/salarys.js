import Layout from '@/layout'

export default {
  // 1-1.一级路由 + 加载组件
  path: '/salarys',
  component: Layout,
  children: [{
    path: '',
    name: 'Salarys',
    component: () => import('@/views/salarys/salarys.vue'),
    meta: { title: '工资', icon: 'money' }
  }]
}
