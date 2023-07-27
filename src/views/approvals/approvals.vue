<template>
  <div class="approvals-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        审批管理
        <!-- 这个是 组件通信：子组件 传给父组件，。。。 -->
        <demofuzitx @click="sonClick" />
      </el-card>
    </div>
  </div>
</template>

<script>
import demofuzitx from './demofuzitx.vue'

export default {
  components: {
    demofuzitx
  },
  methods: {
    sonClick() {
      console.log('my demo son')
    }
  }
}

</script>
