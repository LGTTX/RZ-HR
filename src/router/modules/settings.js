import Layout from '@/layout'

export default {
  // 1-1.一级路由 + 加载组件
  path: '/settings',
  component: Layout,
  children: [{
    path: '',
    name: 'Settings',
    component: () => import('@/views/settings/settings.vue'),
    meta: { title: '公司设置', icon: 'settings' }
  }]
}
