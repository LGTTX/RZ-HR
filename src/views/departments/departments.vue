<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->

        <!-- el-row / el-col属于布局容器-->

        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <!-- 每一个 栅栏值最多是 24格, 在 element  layout 中 -->
          <el-col :span="20">
            <svg-icon icon-class="bank" /><span>科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <!-- 1.对于这个 :props="defaultProps" 必要也罢，就跟 table 一样，最终需要什么内容，
             还需我们使用插槽去获取
        -->
        <!-- 2. default-expand-all	是否默认展开所有节点 -->

        <!-- :data="list" 有多少个数据对象， 都会自动帮你 遍历出来 -->

        <el-tree default-expand-all :data="list">
          <!--3. 官网解释了 需要 slot-scope="{ node, data } ，不像以前的 row  -->
          <!--4. 但我们 用解构出来最好，用谁解谁 , data 就是一个数据对象 -->
          <template v-slot="{data}">
            <!--4-1. 通过打印 scope.data, 发现它拿到的是 list 的全部数据，所以我们可以挑选 -->
            <!-- {{ scope.data }} -->
            <!-- {{ data.name }} -->
            <!-- 5. 但我们发现需求的布局与 我们的 开始的第一大行一样，所以我们直接复制过来 -->
            <!-- 6. 我们还要加上一个宽度 width 才可以展开来 -->
            <el-row
              type="flex"
              justify="space-between" 
              align="middle"
              style="height: 40px; width: 100%;"
            >
              <!-- 每一个 栅栏值最多是 24格, 在 element  layout 中 -->
              <el-col :span="20">
                <!-- <svg-icon icon-class="bank" /> -->
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <!-- 下拉菜单 element -->
                  <el-col>
                    <el-dropdown>
                      <span>
                        操作<i class="el-icon-arrow-down" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>添加子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>

      </el-card>   
    </div>
  </div>
</template>

<script>
// 注意是按需导入
import { getDepartments } from '@/api/departments'

export default {
  data() {
    return {
      // 1.只是用来测试的，测试完就必要了
      // list: [{
      //   name: '财务部',
      //   manager: '刘备',
      //   children: [
      //     {
      //       name: '财务核算部',
      //       manager: '张飞'
      //     },
      //     {
      //       name: '税务核算部',
      //       manager: '关羽'
      //     }
      //   ]
      // }]
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // }
      list: []
    }
  },
  // 2.发请求一般都是最好异步发
  async created() {
    const res = await getDepartments()
    // console.log(res)
    // 3. 之后在 打印台响应数据的地方查看即可
    this.list = res.data.depts
  }
}
</script>
