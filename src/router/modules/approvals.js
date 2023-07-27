import Layout from '@/layout'

export default {
  // 1-1.一级路由 + 加载组件
  path: '/approvals',
  component: Layout,
  children: [{
    path: '', // 作为默认渲染路由
    name: 'approvals',
    component: () => import('@/views/approvals/approvals.vue'),
    meta: { title: '审批', icon: 'tree-table' }
  }]
}
