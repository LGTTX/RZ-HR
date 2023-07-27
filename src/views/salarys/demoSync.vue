<template>
  <div>
    子组件 - son.vue
    <br>
    <!-- count 名字自定义 -->
    count 的值为 : {{ count }}
    <br>
    <el-button size="mini" @click="hclick">点我给 count +1</el-button>
  </div>
</template>

<script>
export default {
  // 1. 父传子： 使用 props 接收 父组件传过来的值
  props: {
    // 1-1. 接收对象可自定义
    count: {
      type: Number,
      required: true
    }
  },
  methods: {
    // 3.1.规范一点就加上 emits,但报错，就算了
    // emits: ['input'],
    hclick() {
      // 2. 设置一个事件
      // 2-1.不可以修改 父组件传过来的数据, 单项数据流的限制（修改生效，但报错，不符合规范）
      // this.value++
      // 2-2.所以去 父组件那 给这个导入的 子组件 修改

      // 3.既然需要到 父组件 那里修改 这个 数据，那么就得使用 emits 注册事件
      // ---》在把需要修改的 数据 当作 该事件的参数，一起传 到父组件，父组件在接收即可
      // this.$emit('事件', 事件参数)
      this.$emit('update:count', this.count + 1)
    }
  }
}

</script>

