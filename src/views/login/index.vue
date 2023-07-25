<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!--
        表单校验的三个步骤;
        1．定义规则
        2.应用规则(三要素)
        a. el-form的modelb. el-form的 rules
        c. el-form-item 的 prop
        3．兜底校验
      -->

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!--  prop 一定是得与 接口文档一样的 -->
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        class="loginBtn"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <!-- 即先点击 登录 token 存入 vuex, 再次点击测试-->
      <!-- 测试 获取到 token 没 -->
      <!-- <el-button @click="getUserProfile">获取用户信息</el-button> -->

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
</template>
 
<script>
// 按需导入
// 封装用户手机号
import { validMobile } from '@/utils/validate'

// 封装到 store 的 user 中了，此处只需调用即可
// import { getProfile } from '@/api/user'

// import { login } from '@/api/user'

export default {
  name: 'Login',
  data() {
    // 1.validator 自定义校验
    const validateMobile = (rule, value, callback) => {
      // rule：采用的规则
      // value: 被校验的值
      // callback是回调函数
      // 使用这个封装起来的  validMobile 复用性高
      // pattern:定义正则,真正项目开发时其实用的比较少，因为复用性不高
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { trigger: 'blur', validator: validateMobile }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 6, max: 16, message: '密码的长度在6-16位之间', trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 测试 token 添加成功没
    // async getUserProfile() {
    //   console.log('获取用户信息')
    //   const res = await getProfile()
    //   console.log(res)
    // },
    // 兜底校验
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // login 得到的结果就是一个对象
          // 所谓的 login 就是把 this.$http() 这个代码封装到 login 函数中了（大大维护了代码的可维护性）
          // const res = await login(this.loginForm)
          // console.log(res)

          // 原本语法:我们使用这个也可以  login(this.loginForm).then().catch(),但用了 async/await 之后就得用 try..catch

          // 也可以使用 fetch,但是都使用 axios 了

          // 1. 目的，出现超时时提醒用户
          // try 代码块包裹 [可能] 会出错的代码（未知）
          // 因为发网络请求可能正确，也有可能错误
          // 使用 try...catch, 不管正确还是错误都会有结果
          // 这里就是捕获和不捕获的区别
          // 1-1 但是会有一个问题 （try..catch 是根据 axios 的响应状态来判断的）
          // --》比如发送请求时后台返回的 status 是 200，这是 执行的是 try ,但用户密码是错误的，
          // --》这就是响应的状态码是正确的，但响应结果是错误的,该咋办呢, 因为这种情况是不会进 catch 的
          
          // 改造前:在组件内发请求,调用 mutations 操作state

          // try { // 没出错时捕获
          //   // 假如这行代码出错了，那下面那些代码就不会执行了，就直接跳转到 catch 处理
          //   const res = await login(this.loginForm)
          //   // console.log(res)
          //   // 1-3 调用 mutations 将 token 存入 vuex 中
          //   // --》直接写就行，因为 this 获取的是 $store
          //   // --》this 只能在组件中使用，不可在 js 文件中使用，这就是原因
          //   this.$store.commit('user/updataToken', res.data)
          //   // 1-2. 如果没有拦截器, 还需要在此处判断 success
          //   // if (re.code !== 0)  // 大事件
          //   // if(! res.success) // 人资
          //   // --》在有了拦截器之后，所有的请求响应的这些判断都交给拦截器来管理，提高了我们
          //   // --》写代码的效率，与解决了代码的一些冗余
          // } catch (event) { // 出错时捕获
          //   // 还有 catch 一定要做提示的，不然出错时，不会提示
          //   // console.log(event)
          //   // console.dir(event)
          //   this.$message.error(event.message)
          // }

          // 改造后:在 actions发请求，组件内只需要调用 actions 即可

          // 1. 如果需要捕获到异常，要在 dispatch 前加 await 等待请求完成
          try {
            // 一定要记得加await否则会出现登录失败但依然跳转到首页的意外情况
            // 原因就是 不加 await，它就根本不等你返回结果，就直接执行 跳转首页了
            await this.$store.dispatch('user/postLogin', this.loginForm)
            
            // 2-1.后端的提示不好，前端自己写,放到 store 的 dispatch 里
            
            // 2.登录成功之后 跳转首页
            // this.$router.push('/')

            // 3.不是直接跳到首页，而是跳转至指定的页面
            // 获取传递过来的 return_url
            // 路由传参:
            // path + query
            // name + params
            // 注意，打印前注释掉以前的跳转
            // console.log(this.$route.query) 
            console.log(this.$route) 
            // {return_url: '/form/index'}--》return_url: "/form/index"
            // 3-1. 到这一步,可以手动输入 return_url 就会自动跳转到输入指定的页面了
            // 3-2. query(查询参数) ： 代表当前地址的 search 属性的对象--》query(查询参数，一个对象),代表当前搜素地址的路径
            this.$router.push(this.$route.query.return_url || '/')
            
            // 
            // this.$router.push(this.$route.fullPath || '/')
            // console.log('index:', this.$route)

            // this.$route.push({
            //   path: `${this.$route.query.return_url || '/'}`,
            //   query: {
            //     return_url: this.$route.fullPath
            //   }

            // })
            
            //  3-3. 注意,此处的 return_url 是自定义的,但要保证 点击退出保存那里也跟这里的一样

            // 3-4.在点击退出后，会传
          } catch (event) {
            this.$message.error(event.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
//@表示 src
//但是@符合只能在script和 template标签中使用
// 在style中需要在符号前面加一个~

.login-container {
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      // 为了兼容性，还得加这行
      appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }

  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
}

/* reset element-ui css */
.el-form-item__error {
	color: #fff
}
}
</style>

<!-- 对于只在当前页面的样式应该加到这里 -->
<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
