<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- 面包屑，这里不需要 -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="app-breadcrumb">
      科技股份有限公司
      <span class="breadBtn">体验版</span>
    </div>

    <div class="right-menu">
      <!-- 可以去 element 看看 dropdown -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <!-- add -->
          <img src="@/assets/common/bigUserHeader.png" class="user-avatar">
          <!-- 初始语法 -->
          <!-- <span class="name">{{ $store.state.user.userInfo.username }}</span> -->
          <!-- 在 getters 设置了之后 -->
          <!-- <span class="name">{{ $store.getters.username }}</span> -->
          <!-- 通过 辅助函数， 下面已经有了，只需加上 username 解构出来 -->
          <span class="name">{{ username }}</span> 
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <!-- Home -->
              <!-- add -->
              首页
            </el-dropdown-item>
          </router-link>
          <!-- add -->
          <a target="_blank" href="https://github.com/LGTTX/RZ-HR.git/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <!-- <span style="display:block;">Log Out</span> -->
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'username',
      'staffPhoto'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1.用户点了确定, 清空 token
        // 我们加异步是为了确认删除 token, 信息后在执行下面的操作
        await this.$store.dispatch('user/logout')
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        // 1-1.跳转至登录页
        // this.$router.push(`/login`)
        // 1-3. $route.path 当前路由地址
        // 1-3-1.这样的话有 bug, 如果在嵌套一层，在登录跳转之后，在次添加查询参数，这时返回就不是目标页面了
        // ？代表一种条件。一个接口。
        // this.$router.push(`/login?return_url=${this.$route.path}`)
        // console.log(this.$route.path)  // /form/index

        // 1-4. 所以使用 fullpath 来解决 1-3-1的问题
        // fullpath 和 path 的区别、
        // fullPath  （当前）路径 + query 。  包含查询参数
        // path   （当前）路径。 不包括 查询参数
        // path 会忽略 params, 所以必须使用 query 传参

        // console.log(this.$route)
        // this.$router.push(`/login?return_url=${this.$route.fullPath}`)
        
        // 1-5. 1.6 最终解决方案两种
        // 由于浏览器的URL 的参数中不可以有中文和特殊符号(/ & : )，所以需要人工转码
        // encodeURI :可以转码中文,但不能转码符号
        // encodeURIComponent:所有特殊字符都可以转码
        // console.log(this.$route.fullPath)
        // this.$router.push('/login?return_url=' + encodeURIComponent(this.$route.fullPath))
        // 1-5-1. 注意,在添加路径时，得点击出现的的提示路径，相当于刷新一下，不然获取不到
        // this.$router.push(`/login?return_url=${encodeURIComponent(this.$route.fullPath)}`)
        // this.$router.push('/login?return_url=' + encodeURIComponent(this.$route.fullPath))
        // 1-6 使用编程式导航传参
        this.$router.push({
          path: '/login',
          query: {
            return_url: this.$route.fullPath // 路由会帮我们转码,无需手动处理
          }
        })
        // 1-2.可以在优化一下用户体验
        // 退出登录成功
        this.$message.success('退出成功')
      }).catch(err => err)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  // add background-image
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  // 面包屑样式不需要
  // .breadcrumb-container {
  //   float: left;
  // }

  // add
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
}

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      // alter
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          // width: 40px;
          // height: 40px;
          // border-radius: 10px;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        // add
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left:5px;
         }
        .user-dropdown {
          color: #fff;
         }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
