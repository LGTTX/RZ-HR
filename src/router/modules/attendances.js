import Layout from '@/layout'

export default {
  // 1-1.一级路由 + 加载组件
  path: '/attendances',
  component: Layout,
  children: [{
    path: '', // 作为默认渲染路由
    name: 'attendances',
    component: () => import('@/views/attendances/attendances.vue'),
    meta: { title: '考勤', icon: 'skill' }
  }]
}
