<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roles">
              <!-- type="index"":该列为序号1开头
                  如果设置了 type=index，可以通过传递 index 属性来自定义索引,从 1 开始计算
               -->
              <!-- 对应列内容的字段名，也可以使用 property 属性 -->
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger" @click="hDel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <!-- current-page:当前页-->
              <!-- page-size:每页显示多少条 --> 
              <!-- total:总条数-->
              <!-- page-sizes:设置每页显示多少条的选项-->
              <!-- size-change:当page-size发生变化时触发-->
              <!-- current-change:当前页发生变化时触发-->

              <!-- page-sizes 至少有一个 2，因为我们默认值是2 -->
              <el-pagination
                :current-page="pageParams.page"
                :page-sizes="[2, 3, 5, 10]"
                :page-size="pageParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="hSizeChange"
                @current-change="hCurrentChange"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>

        <!-- 新增弹框 -->
        <el-dialog
          title="编辑弹层" 
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="showDialog"
        >
          <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.description" />
            </el-form-item>
          </el-form>
          <!-- 底部 -->
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small">取消</el-button>
              <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card> 
    </div>
  </div>
</template>

<script>
import { getRolesList, delRoleById } from '@/api/roles'

export default {
  data() {
    return {
      // 注意: 参数写错了也不会宝座，但它会是默认值
      pageParams: {
        page: 1,
        pagesize: 2
      },
      roles: [],
      total: 0,
      showDialog: false,
      roleForm: {
        name: '',
        // 使用线上的接口文档，这些名字要与之一样
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadRolesList()
  },
  methods: {
    async loadRolesList() {
      try {
        const res = await getRolesList(this.pageParams)
        // console.log(res)
        this.roles = res.data.rows
        this.total = res.data.total
      } catch (event) {
        // this.$message.error(event.message)
        console.log('获取角色列表失败:', event)
      }
    },
    hCurrentChange(val) {
      // current-change事件: 当前页码改变时触发
      this.pageParams.page = val
      this.loadRolesList()
    },
    hSizeChange(val) {
      // size-change事件: 当每页显示的条数发生变化时触发。即 page-size 修改时触发
      this.pageParams.pagesize = val
      this.loadRolesList()
    },
    async hDel(id) {
      // console.log(id)
      // 1，提醒用户是否删除
      // 在 如果不写 confirmButtonText 那么默认是 英文的，但我们使用了语言包即可
      // this.$confirm('是否删除该角色?', '提示', {
      //   // confirmButtonText: '确定',
      //   // cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(async() => {
      //     // 2．用户确定后，发请求删除

      //     // 捕获：任何错误都是异常
      //     // 虽然有拦截器帮我们处理了，但是加上 捕获 才是最严谨的，保证不会出错
      //     try {
      //       const res = await delRoleById(id)
      //       // 3．删除完毕后根据结果提醒用户
      //       this.$message.success(res.message)
      //       this.loadRolesList()
      //     } catch (event) {
      //       // 如果不加 catch() ,则报错 uncatch,所以正常些就行
      //       this.$message.error(event.message)
      //       // console.log('删除信息错误')
      //     }
      //   })
      //   .catch(err => err)

      // 1.处理异常:
      // 1-1所有异步操作原则上来讲都需要处理异常
      // 方案1: try - catch(需要嵌套一层)
      // 方案2: await 结合 .catch处理

      const result = await this.$confirm('是否删除该角色?', '提示', {
        // confirmButtonText: '确定',
        // cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(e => e) // 返回值是e,e是cancel

      // .catch(e => {})  // 没有返回结果,所以返回值是undefined

      // 2.处理异常前:点确定confirm，点取消报错
      // 2-1.需求:知道用户点的是确定还是取消?
      // 2-2.在promise 的串行任务中，每一次回调函数(包括 .then 和.catch)中返回的结果，会作为下一个.then 的参数

      if (result === 'cancel') return
      // console.log('111')
      // 3.发请求 
      const res = await delRoleById(id).catch(err => this.$message.error(err.message))
      // 4．删除完毕后根据结果提醒用户
      this.$message.success(res.message)

      // 5.处理分页的问题:最后一页只有个元素时
      // 所有分页的删除 Bug都是这么处理
      // 解决 bgu3 : 判断 当前页 artList.length 是否为 1, 为 1 的话，就执行 this.q.pagenum -= 1
      // ----》 即,自动条转到上一页（写在下面最好）
      // 并且还得保证 this.q.pagenum > 1 才可以 --
      // 简洁描述:
      // 如果当前数组长度只有1说明最后一条数据已经被删除了，所以需要让 pagenum--
      // 但是 pagenum最小只能减到1，所以需要加一个&8 this.q.pagenum > 1
      if (this.roles.length === 1 && this.pageParams.page > 1) {
        this.pageParams.page--
      }

      // 6.重新发请求获取数据
      this.loadRolesList()
    },
    hSubmit() {

    }
  } 
}

</script>
