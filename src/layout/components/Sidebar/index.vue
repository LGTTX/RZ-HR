<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 1. 
          route =》 this.$router.options.routes -->
        <!-- route 就是每一项 routes 数组中的数据，里面有 path 属性-->
        <!-- item 就是 route  -->
        <!-- 在 route 里面有的路由还绑定 hidden, 所以就是通过 判断是否有 
          hidden 来渲染的组件到 SidebarItem 的  -->
        <!-- 2. item 就是循环组件 -->
        <sidebar-item
          v-for="route in routes" 
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
 
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // console.log(this.$router)
      // console.log(this.$router.options.routes)

      // 1.router.options.routes:路由规则数组,路由表
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      // 取的就是 settings 中的 sidebarLogo 的值
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
