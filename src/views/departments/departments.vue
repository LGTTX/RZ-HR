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
                  <!-- 3.
                      带有全局 slot 属性的元素分配给由 <slot> 创建的槽，
                      它的 name 属性的值匹配 slot 属性的值。
                     -->
                  <el-dropdown-menu slot="dropdown">
                    <!-- 4. 传入空的 id 就表示一级部门
                          注意，要传 false, 摆摊添加后 isEdit 是 ture
                    -->
                    <el-dropdown-item 
                      @click.native="hAddOrEdit('', false)"
                    >添加子部门</el-dropdown-item>
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

        <!-- :data="list" 有多少个数据对象， 都会自动帮你 遍历出来 
            --》虽然它会自动匹配到 相关的 prop 属性
            --》但是我们通过 v-slot={node data} 的值，就可以获取到跟 prop 属性一样的值
        -->

        <el-tree default-expand-all :data="list">
         
          <!--3. 官网解释了 需要 slot-scope="{ node, data } ，不像以前的 table 我们用 row  -->
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
                      <!-- 3.
                            带有全局 slot 属性的元素分配给由 <slot> 创建的槽，
                            它的 name 属性的值匹配 slot 属性的值。
                      -->
                      <el-dropdown-menu slot="dropdown">
                    
                        <!-- 1.这时，如果没有使用 native, 那么 -->
                        <!-- 2.
                            如果子组件内部没有触发 click 事件，可以在父组件上加
                            .native 修饰符,其作用是将 click 绑定给子组件的根标签
                        -->
                        <!-- 4.因为子组件 AddOrEdit 中的参数需要一个 id 参数，我们需要从此
                              父组件中传到 子组件 AddOrEdit 中
                              --》所以我们要的数据就在 上面的 v-slot 中
                              --》通过 hAdd 打印 data, 发现 id 可以拿了
                              
                              --》并且这样有一个好处，在 AddOrEdit 子组件加载前 我们就拿到 id 传过去了
                            -->
                        <el-dropdown-item @click.native="hAddOrEdit(data.id, false)">添加子部门</el-dropdown-item>
                        <!-- -----》 通过 插槽 渲染 data, 可以发现轻松拿下 id, 每个部门 id 都不一样  -->
                        <el-dropdown-item @click.native="hAddOrEdit(data.id, true)">编辑部门</el-dropdown-item>
                        <!-- 如果当前部门有子部门，就不提供删除功能 -->
                        <!--  v-if="data.children.length === 0" -->
                        <el-dropdown-item 
                          v-if="!data.children.length"
                          @click.native="hDel(data.id)"
                        >删除部门</el-dropdown-item>
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

    <!-- 2. -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <!-- 2-1.将添加 与 编辑的弹窗放在一个组件里 -->

      <!-- 3. 再点击 hAdd 后，将 当前部门 id 传给子组件 
              子组件接收到后，
      -->
      <!-- 4.
        烤串命名法:常用于标签属性
        驼蜂命名法:常用于变量
        这两种命名方式在组件使用 / Props传值时可以互相替代使用
       -->
      <!-- 5. bug1: 在编辑时，只有第一次点编辑时，才能正确显示。随后再点编辑，数据显示不正确了 -->
      <!-- 方案1:v-if，最推荐的方案,没有之 -->
      <!-- 5-1. 解决 bug1: 使用v-if, v-if为false时，子组件会被删除！ -->
      <!--  ===》 v-if 会在DOM上添加或删除,如果用在组件上，就会创建和销毁组件 -->
      <!--  ===》v-if="showDialog”将组件的生命周期和 dialog的显示隐藏绑定 -->
      <AddOrEdit
        v-if="showDialog"
        :id="curId"
        :is-edit="isEdit"
        :origin-list="originList"
        @success="hSuccess"
        @close="hClose"
      />
    </el-dialog>
  </div>

</template> 

<script>
// 注意是按需导入
import { getDepartments, delDepartment } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddOrEdit from './deptDialog.vue'
export default {
  components: {
    AddOrEdit
  },
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
      list: [],
      showDialog: false,
      // 当前被点击的部门的 id
      curId: '',
      isEdit: '',
      originList: []
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑' : '添加'
    }
  },
  // 2.发请求一般都是最好异步发
  created() {
    this.loadDepartments()
    // this.load
  },
  methods: {
    // 1.封装函数
    async loadDepartments() {
      // 4. 同样的，还是需要捕获错误

      // 4-1. try-catch为了捕获异常,减少网页中错误的出现
      try {
        const res = await getDepartments()

        // console.log(res)
        // 3. 之后在 打印台响应数据的地方查看即可

        // 5.shift会取出数组第一个元素，同时会改变原数组
        // 5-1 很妙：
        // 后端返回的数据中 第一条是公司信息，它应该直接就是tree的根节点
        // 为了后面计算方便，把它直接取出来
        // 所以使用 shift()，可以取出来，并且把它在原数组中删除掉
        res.data.depts.shift()

        // 7.表单校验-业务校验，需要获取平铺结构是四个数据
        // this.originList = res.data.depts
        // 7-1. 之后使用映射数组出来即可
        // this.originList = res.data.depts.map(item => {
        //   return { id: item.id, pid: item.pid, name: item.name, code: item.code }
        // })
        // 7-2.优化1
        // this.originList = res.data.depts.map(item => 
        //   ({ id: item.id, pid: item.pid, name: item.name, code: item.code })
        // )
        // 7-3.优化2 : 最高级最优雅的代码
        // 解构 {id, pid，code，name}:等于把 item 的四个属性结构到当前作用域的局部变量
        // 7-3-1.一个诡异的现象，解构形参必须加上 ()
        // this.originList = res.data.depts.map(({ id, pid, code, name }) => ({ id, pid, code, name }))
        this.originList = res.data.depts.map(({ id, pid, code, name }) => { return { id, name, code, pid } })
        // 6. 把 depts 中平铺的数组结构转成树形结构
        // 6-1.tranListToTreeData 已经封装好了
        // const company = res.data.depts.shift()
        // console.log(company)
        // this.list = res.data.depts
        
        this.list = tranListToTreeData(res.data.depts)

        // pid标识当前部门的父部门id
      } catch (event) {
        console.log('获取部门信息失败~~:', event)
      }
    },
    // 1. 高级写法，只需根据 isEdit 来判断
    hAddOrEdit(id, isEdit) {
      // console.log(id)
      // 1. 先随便显示一下，看是否能够弹窗
      this.showDialog = true
      // 2.将当前所在传 id
      this.curId = id

      // 3. 对当前所在的逻辑
      this.isEdit = isEdit
    },
    // 2. 对于有关联的，这种时低级写法
    // hAdd(id) {
    //   // console.log(id)
    //   // 1. 先随便显示一下，看是否能够弹窗
    //   this.showDialog = true
    //   // 2.将当前点击的部门 id 传给子组件
    //   this.curId = id

    //   // 3. 对当前在添加的逻辑
    //   this.isEdit = false
    // },
    // hEdit(id) {
    //   // 1. 先随便显示一下，看是否能够弹窗
    //   this.showDialog = true
    //   // 2.将当前点击的部门 id 传给子组件
    //   this.curId = id
    //   // 3.当前在编辑的逻辑
    //   this.isEdit = true
    // },
    hSuccess() {
      // 收到子组件通知的成功,报喜
      // 关闭dialog
      this.showDialog = false

      // 获取最新数据,更新数据还得在父组件更新才行
      this.loadDepartments()
    },
    hClose() {
      this.showDialog = false
    },
    hDel(id) {
      // 关于删除 部门 的 data 打印看看
      // console.log(data)
      // 1.提示用户是否确定移除 
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
          // 2.当用户确定利除后发清求
            const res = await delDepartment(id)
            // 3. 根据结果提醒用户
            this.$message.success(res.message)
            // 4.重新获取组织架构
            this.loadDepartments()
          } catch (event) {
            this.$message.error(event.message)
          }
        })
        .catch(err => err)
      // 2.当用户确定删除后发请求
      // 3.重新获取组织架构
    }
  }
}
</script>
