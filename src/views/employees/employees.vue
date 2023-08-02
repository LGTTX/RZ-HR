<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- page-tools 已经全局注册了 -->
      <page-tools>
        <template #left>
          <span>总记录数: {{ total }} 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small">excel导入</el-button>
          <el-button type="danger" size="small">excel导出</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </page-tools>
 
      <el-card style="margin-top: 10px;">
        <el-table :data="employeeList" border>
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workNumber" />
          <!-- <el-table-column label="聘用形式" prop="formOfEmployment"> -->
          <!-- 因为 聘用形式 是 1，所以是后台让我们自己写 -->
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <!-- 这时我们使用作用域插槽 -->
            <template v-slot="{row}">
              <!-- 后台给的 是编码， 所以我们通过调用编码 获得我们的数据 -->
              {{ formatEmployment(row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" />
          <!-- 后台就没有给你这个信息，所以不写它 -->
          <!-- <el-table-column label="账户状态" prop="" /> -->
          <el-table-column label="操作" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
// 在导出有名字就按需导入，默认导出就直接导整个
import { getEmployees } from '@/api/employees'
// empContant 我们为这个工具起的名字
import empConstant from '@/constant/employees'

// 4.将聘用形式的常量转成:{1:‘正式"，2:'非正式}
// const hireType = {}
// empContant.hireType.forEach(item => {
//   // 5. 以 item.id 为键， item.value 为值，加入 obj 对象
//   hireType[item.id] = item.value
// })
// 7. 再优化: 使用 reduce
const hireType = empConstant.hireType.reduce((total, item) => { return { ...total, [item.id]: item.value } }, {})
console.log('枚举信息', empConstant.hireType, hireType)

export default {
  data() {
    return {
      pageParams: {
        page: 1,
        size: 10
      },
      total: 0,
      employeeList: []
    }
  },
  created() {
    this.loadEmployees()
  },
  methods: {
    async loadEmployees() {
      // 1.发请求拿数据
      const res = await getEmployees(this.pageParams).catch(e => console.log('请求员工信息失败'))
      // console.log(res)
      this.total = res.data.total
      this.employeeList = res.data.rows
    },
    formatEmployment(code) {
      // console.log(code)
      
      // 1.需求: 通过 code 去 constant/employees.js 中的 hireType 找到对应的 value返回
      
      // 2.打印结果查看
      //  console.log(empContant.hireType)
      // const result = empContant.hireType.find(item => item.id === code)
      // // result.value  因为 find 查找后，返回了 item, item 是一个对象
      // return result.value

      // 3.问题:函数会执行n 次，循环会执行 m 次，所以如果不做优化，代码将执行n * m次，非常损耗性能
      
      // 6.
      return hireType[code]
    }
  }
}
</script>
