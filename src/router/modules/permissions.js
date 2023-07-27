import Layout from '@/layout'

export default {
  // 1-1.一级路由 + 加载组件
  path: '/permissions',
  component: Layout,
  children: [{
    path: '', // 作为默认渲染路由
    name: 'permissions',
    component: () => import('@/views/permissions/permissions.vue'),
    meta: { title: '权限管理', icon: 'lock' }
  }]
}
