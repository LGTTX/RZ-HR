<template>
  <div class="salarys-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        工资管理
        <!-- 3-2. ---》在把需要修改的 数据 当作 该事件的参数，一起传 到父组件，父组件在接收即可
                   这个 val 就是子组件传过来的数据，传过来后，在这里父组件给它赋值 
                   在父组件给 count 赋值就可以赋值了，就不存在 单项数据流了
        -->
        <!-- 3-3. 这个就是双向绑定的原理 -->
        <demofuzitx :value="count" @input="val => count = val" />
        
        <!-- 4. 这个 使用 v-model 就可以简化上面的事情
                等价的
        -->
        <demofuzitx v-model="count2" />

        <!--5. 总结:
          原理: v-module 本质上就是一个语法糖
          1.给子组件绑定一个value 属性
          2.给子组件绑定一个input事件,事件处理函数中给绑定的变量赋值 
        -->

        <!-- 6. sync 修饰符 -->
        <!-- 6-1: 典型的父向子传值，那么这个值是不能够修改的 -->
        <!-- 6-2: 但加了 .sync 之后 , 你看, 子组件 demoSync 
                  就可以修改 父组件传过来的数据了 
        -->
        <demoSync :count.sync="count" />
        <!-- 7-3. 而它的原理就是 -->
        <demoSync :count="count" @update:count="val => count = val" />
        <!-- 7.
          由于v-model只能在组件或标签上设置一次,如果需要有多个变最双向绑定，就无法很好的实现
          
          原理:和v-model 极其类似
          
          区别:
          1. v-model在标签上只能绑定1个，.sync 可绑定多个
          2. 
          （1）v-model 用的 事件名 input，展性名是value, 
          （2） .sync 用的 事件名 update:属性名(绑定属性名)，属性名自定义

            --》.sync 的局限性， 就是得通过 update:属性名 （update 绑定 属性名）

            --》 .sync 就是可以修改 父组件传向 子组件的 数据 ， 而不违反单项数据流
            
            --》不用 .sync 无非就是 多绑定一个数据
        -->
      </el-card>
    </div>
  </div>
</template>

<script>
import demofuzitx from './demofuzitx.vue'
import demoSync from './demoSync.vue'
export default {
  components: {
    demofuzitx,
    demoSync
  },
  data() {
    return {
      count: 0,
      count2: 0
    }
  }
}
</script>
