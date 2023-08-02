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
                @click="hAdd()"
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
              <el-table-column label="角色描述" prop="description" />
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <!-- 因为编辑的数据很简单，不用发请求获取数据，直接通过 row 获取即可 -->
                  <el-button size="small" type="primary" @click="hEdit(scope.row)">编辑</el-button>
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

        <!-- 注意: 重置表单 resetFields 属性主要靠 prop 属性， 没有这个属性就不清空-->
        <!-- bug4: 使用 @closed="$refs.roleForm.resetFields() 重置表单后
             如果先点击 编辑， 再点击 新增，那么就会出现 bug，就是还会出现 编辑时的数据
             原因： 主要跟 resetFields 的机制有关 
             --》即 重置表单，还原为默认值
             --》所以 第一次点击 编辑时 就是 默认值
             解决: hClosed
        -->
        <el-dialog
          :title="dialogTitle" 
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :visible.sync="showDialog"
          @closed="hClosed"
        >
          <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" />
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="roleForm.description" />
            </el-form-item>
          </el-form> 
          <!-- 底部 -->
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" @click="showDialog = false">取消</el-button>
              <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card> 
    </div>
  </div>
</template>

<script>
import { 
  getRolesList, 
  delRoleById, 
  addRoles,
  updataRoles
} from '@/api/roles'

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
      },
      // 因为共用一个 dialog, 所以使用 isEdit
      isEdit: false
    }
  },
  computed: {
    // 1.返回最大页码数
    // 1-1.但没必要，因为就一个地方用到，且代码就一行
    // 1-2.好处就是可以在控制台查看调式
    // MaxNum() {
    //   return Math.ceil(this.total / this.pageParams.pagesize)
    // }
    dialogTitle() {
      return this.isEdit ? '编辑' : '添加'
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
      // 但是 pagenum 最小只能减到1，所以需要加一个&8 this.q.pagenum > 1
      if (this.roles.length === 1 && this.pageParams.page > 1) {
        this.pageParams.page--
      }

      // 6.重新发请求获取数据
      this.loadRolesList()
    },
    async hSubmit() {
      // isEdit 的兜底校验挪来这

      // 1-2.兜底校验要加上校验失败时捕获，不然报错 'false',因为我们之前使用的是 try..catch
      // --》因为此时 validate 返回的是 promise
      // valid 相当于 校验成功时的结果， 及校验不成功（即出错了）则执行 catch()（会返回 catch 中的定义数据），然后执行下面的 if 语句退出
      const valid = await this.$refs.roleForm.validate().catch(e => e)
      if (!valid) return console.log('校验不成功')
      // this.doAdd()
      this.isEdit ? this.doEdit() : this.doAdd()
    },
    async doAdd() {
      // ------》 》 优化前
      // 1.兜底校验
      // this.$refs.roleForm.validate(async valid => {
      //   if (!valid) return

      //   // 2.发请求
      //   // 2-1.此处与 try..catch 有点区别就是，try...catch 想包哪里包都可以，
      //   // --》但我们这样做，最多就是 发请求那出现异常而已，这样做也不用嵌套，简洁
      //   const res = await addRoles(this.roleForm).catch(e => this.$message.error(e.message))
      //   // 3.提示用户
      //   this.$message.success(res.message)
      //   // 4.关闭 dialog
      //   this.showDialog = false
      //   // 5.重新获取数据
      //   this.loadRolesList()
      // })

      // ---》 》 优化后
      // 1.兜底校验
      // 1-1. validate 如果不传入回调函数，那么它最终会返回一个 promise
      // --》 那么 valid 就相当于它返回的 promise 的结果

      // 1-2.await（给 promise 加 await 是因为 promise 的 .then .catch 之前的代码都是同步的） 
      // --》后是 promise，返回值是promise.then回调函数中的第一个参数
      // --》通俗来讲就是成功的结果

      // 1-3.兜底校验要加上校验失败时捕获，不然报错 'false',因为我们之前使用的是 try..catch
      // --》因为此时 validate 返回的是 promise
      // const valid = await this.$refs.roleForm.validate().catch(e => e)
      // if (!valid) return
      // 2.发请求
      // 2-1.此处与 try..catch 有点区别就是，try...catch 想包哪里包都可以，
      // --》但我们这样做，最多就是 发请求那出现异常而已，这样做也不用嵌套，简洁
      const res = await addRoles(this.roleForm).catch(e => this.$message.error(e.message))

      // 6. 跳转到最后一页
      // 6-1.最后一页: Math.ceil(total/pagesize) =》 ceil 向上取余
      const MaxNum = Math.ceil(this.total / this.pageParams.pagesize)
      // 6-2.跳转
      this.pageParams.page = MaxNum

      // 7. bug2. 如果 添加的时候，如果最后一页只有一个数量，那么它跳转时就会不正确
      // 7-1.这个是增加了之后再判断
      // 解决:
      if (this.total % this.pageParams.pagesize === 0) {
        // 7-2.以及 因为上面添加的时候， tatal 没更新，所以 判断不对
        // --》所以我们给 total++ 即可
        this.total++
        this.pageParams.page = MaxNum + 1
      }
 
      // 3.提示用户
      this.$message.success(res.message)
      // 4.关闭 dialog
      this.showDialog = false
      // 5.重新获取数据
      this.loadRolesList()
    },
    hAdd() {
      // 1.
      this.showDialog = true
      // 2.
      this.isEdit = false
    },
    hEdit(row) {
      // 1.因为编辑的数据很简单，不用发请求获取数据，直接通过 row 获取即可
      // --》之后与 添加 共用一个 dialog

      // 1-1. 打开 dialog
      this.showDialog = true
      // console.log(row)
      // 1-2.
      this.isEdit = true
     
      // 2. 数据回填 --》   赋值 roleForm 即可
      // bug3: 数据回填时，因为我们使用的是 插槽里面的 row 的数据，那么修改之后
      // --》我们在 dialog 修改 的时候，表单的数据也会实时修改，因为双向绑定
      // 解决: 深拷贝
      // 2-1. 浅拷贝
      // this.roleForm = row
      // 2-2.深拷贝 =》对象字面量
      this.roleForm = { ...row }
    },
    async doEdit() {
      // 1.与表单相关的都必须兜底校验
      // 1-1. 兜底校验 挪到 hSubmit

      // 1-2.兜底校验要加上校验失败时捕获，不然报错 'false',因为我们之前使用的是 try..catch
      // --》因为此时 validate 返回的是 promise
      // const valid = await this.$refs.roleForm.validate().catch(e => e)
      // if (!valid) return

      // 2.发送请求
      // 2-1.这时 this.roleForm 已经变了，因为 数据回填的时候 this.roleForm 已经被替换了

      // --》 此处我们只发 this.roleForm 的原因，虽然接口文档是必须五个，还有其它的，但
      // --》 那是 java 写的，我们本地的 符合我们的也行 this.roleForm
      const res = await updataRoles(this.roleForm).catch(e => this.$message.error(e.message))
      // 3.请求成功提示
      this.$message.success(res.message)
      // 4.关闭 dialog
      this.showDialog = false
      // 5.更新数据
      this.loadRolesList()
    },
    hClosed() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
      this.$refs.roleForm.clearValidate()
    }
  } 
} 

</script>
