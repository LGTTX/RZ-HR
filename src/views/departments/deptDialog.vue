<template>
  <div>
    <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          
          <!-- value值是为了提交给后台的,所以需要看后台要什么，咱们传什么 -->
          <!-- 但此处的 value 值我们刚开始是传 :value="item.id"，-->
          <!-- 但我们要传 username , 
               因为我们打开接口发现，接口新增部门那，压根就没有 id, 说明后台不需要 id
               所以我们要传 username 
               --》即在 el-option 中，看 el-select 的 v-module 绑定什么就传什么
              --》注意:
               ---》在 el-option 中的 value 的值，最终会传给 el-select 的 value 的值

               最后，如果是变量的    一定定的必须加 :
            -->
          <el-option v-for="item in employees" :key="item.id" :value="item.username" :label="item.username" />

        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
        <el-button size="small" @click="hCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 对于 不是 export defalut xxx 的都可以解构出来
import { getEmployeeSimple } from '@/api/employees'
import { 
  addDepartments, 
  getDepartmentById, 
  updataDepartment
} from '@/api/departments'
export default {
  name: 'AddOrEdit',
  // 因为 addDepartments 参数需要 pid 所以要传
  props: {
    id: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      require: true
    },
    originList: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data() { 
    // 参数1:规则对象，没用
    // 参数2:当前被校验的值
    // 参数3:回调函数，决定校验是否通过，callback(new Error()）表示不通过，不传参表示通过
    // --》 所有部门 code 不重复
    const validCode = (rule, value, callback) => {
      // 0. originList: [{ id,pid,name,code }, ...]
      // 1.判断用户输入的内容是否在 originList 中
      // 1-1. some: 判断数组中是否有匹配的项目，如果找到了会立即停止循环,返回一个 true, 没有找到，返回 false
      // 1-2. 对于 添加部门来说，使用法一 法二都行
      // 1-2-1 法一:
      let codeList = this.originList.map(item => item.code)
      // 1-2-2. 法二: 
      // let codeList = this.originList.some(item => item.code === value)
      // console.log(codeList)
      // 2.编辑时的情况 : bug 会将 用户当前值也包含进去校验
      /* 正确做法:
        2-1．我们不能拿 value去判断，而是要知道当前正在编辑哪个部门（this.id)
        2-2．根据id 去原数组中找，除了自己以外的所有部门（得到一个数组)
           *即把当前的所在 id 的对象整个删掉，这样 name, code, 相同的问题也解决了
        2-3．再将数组进行map_映射成 codeListl

        // 只在编辑中的这种情况，所以单一个 if 起来
      */ 
      if (this.isEdit) {
        // 2-4.优化为一行
        codeList = this.originList.filter(item => item.id !== this.id).map(item => item.code)
      }

      if (codeList.includes(value)) {
        callback(new Error(value + '已存在'))
      } else {
        callback()
      }
    }
    // ---》同级部门 name 不重复
    const validName = (rule, value, callback) => {
      // 需求:根据 id 找到所有子部门

      // 获取所有 当前部门的 子部门的 name
      let nameList = this.originList.filter(item => item.pid === this.id).map(item => item.name)
      console.log('当前部门所有子部门:', nameList)
      if (this.isEdit) {
        //  编辑当前部门
        //  需求: 根据 id 找到所有兄弟部门
        // 1．先根据id 找到当前对应的对象
        // 2．找到当前对象的 pid（父级部门的 id)， id 是唯一的
        const pid = this.originList.find(item => item.id === this.id).pid
        console.log(pid)
        // 3．根据 pid 找到所有兄弟部门 (找爸爸的儿子们就是自己的兄弟) && 不包含自己
        // const filterList = this.originList.filter(item => item.pid === pid && item.id !== this.id)
        // console.log(filterList)
        // 3-1.找到当前的兄弟部门之后再映射
        nameList = this.originList.filter(item => item.pid === pid && item.id !== this.id).map(item => item.name)
        console.log('当前部门所有兄弟部门:', nameList)
      }

      if (nameList.includes(value)) {
        callback(new Error(value + '已存在'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 跟获取到的数据一样的类型
      employees: [],
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '部门名称要求2-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          // 自定义校验
          { validator: validCode, trigger: 'blur' }
        ],
        // 特别的， 对于 下拉菜单，我们要用  ['blur', 'change']事件
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // console.log('子组件创建了')

    // 1.不论添加还是编辑都要发送
    this.loadEmployees()
    // 2. 只在编辑部门时发送（加载查询部门详情）
    this.loadDepartment()
  },
  methods: {
    // 点击确定时触发
    hSubmit() {
      // 8.为了可以修改 res, 使用 let
      let res = null
      // 7-.发现添加或编辑最终只有调接口的地方不一样，所以判断加载此处即可
      // 7-1.代码优化后:
       
      // 1-.-兜底校验-(暂时不做)
      this.$refs.deptForm.validate(async valid => {
        if (!valid) return

        // 注意校验要在 try...catch 之前，不然报错
        // 因为我先点确定检验,才可以下一步

        try {
          // try-catch 必须紧贴着委捕获异常的代码块，中间不能问府异步代码

          // 2-.-发请求拿结果
          if (this.isEdit) {
            // 因为 编辑信息我们 不传其它的也行了，传这些个 this.form 够了
            // 只要不影响后面的开发即可
            res = await updataDepartment(this.form)
          } else {
            //
            // 这里的 id 必须传，因为，我们前面的树形组件就是 根据 pid 来判断的
            // --》否则会出错
            // --》虽然接口文档是可以不要， 但我们已经用到它了，必传

            res = await addDepartments({ ...this.form, pid: this.id })
          }
          // 3-.-根据结果提醒用户
          this.$message.success(res.message)
          // 4-.-关闭-dialog
          // 5-.-通知父组件更新数据
          this.$emit('success')
        } catch (event) {
        // console.dir(event)
          this.$message.error(event.message)
        }
      })
      // 之后的 获取最新数据,更新数据还得在父组件更新才行
    },
    // 6-.
    // 根据当前的状态来决定添加还是编辑
    // if (this.isEdit) {
    //   // 做编辑的逻辑
    //   this.doEdit()
    // } else {
    //   // 做添加的逻辑
    //   this.doAdd()
    // }
    
    // async doEdit() {
    //   // 1-.-兜底校验-(暂时不做)
    //   // 2-.-发请求拿结果
    //   try {
    //     const res = await await updataDepartment(this.form)
     
    //     // 3-.-根据结果提醒用户
    //     this.$message.success(res.message)
    //     // 4-.-关闭-dialog
    //     // 5-.-通知父组件更新数据
    //     this.$emit('success')
    //   } catch (event) {
    //     console.dir(event)
    //     this.$message.error(event.message)
    //   }
    // },
    // async doAdd() {
    //   // 用户点击了确定
    //   // 1-.-兜底校验-(暂时不做)
    //   // 2-.-发请求拿结果
    //   // this.form.id = this.id
    //   // 2-1: 因为 addDepartments 参数需要 pid
    //   // 2-2. 只要是 发请求，都要异步
    //   try {
    //     const res = await addDepartments({ ...this.form, pid: this.id })
    //     // console.log(res)
    //     this.$message.success(res.message)
    //     // 5-.-通知父组件更新数据  
    //     this.$emit('success')
    //   // ---》最后在父组件那操作 4. 5.了
    //   } catch (event) {
    //     // console.dir(event)
    //     // 3-.-根据结果提醒用户
    //     // 3-1.响应状态码不对，就执行这
    //     // --》以及拦截器那，如果有错误，会传来这与之结合
    //     this.$message.error(event.message)

    //     // 4-.-关闭-dialog
    //   }
    // },
    // 点击取消时
    hCancel() {
      this.$emit('close')
    },
    // 加载员工信息
    async loadEmployees() {
      const res = await getEmployeeSimple()
      // console.log(res)
      this.employees = res.data
    },
    // 加载查询部门详情,先加载部门详情显示到表单中，才到修改信息
    async loadDepartment() {
      // 组件加载时判断是否为编辑,决定是否发请求
      
      // 判断当前到底是添加还是编辑
      if (!this.isEdit) return

      try {
        // 发送请求获取部门详情
        const res = await getDepartmentById(this.id)
        // 将获取的信息传到 form 中
        this.form = res.data
      } catch (event) {
        console.log('获取部门详情失败', event)
      }
    }

  }

}
</script>

<style scoped>
</style>

