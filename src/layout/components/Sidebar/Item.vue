<script>

// 发现在 item 里面没有 templete, 
// 组件有两种写法，一种是使用 templete, 另一种是使用 render() 函数（就是用1代码去写组件）

// vue 生命周期时介绍过一个小知识点:渲染组件可以看template标签或render函数

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // 此处下面的 信息 配合 sidebarItem 来学习
  render(h, context) {
    // 获取父组件传递过来的 icon 和title
    const { icon, title } = context.props

    // 定义一个空致组:vnodes
    const vnodes = []

    if (icon) {
      // 判断 includes 包不包含 el-icon（element 组件中的 icon 的开头 ）字符串
      if (icon.includes('el-icon')) {
        // 如果包含，则给你加上 一个 标签 包含此 icon
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }

      // 所以分析完 icon 的代码，我们知道，花裤衩这个库能写两种 icon， 
      // --》 本地的icon(自己导入的 svg 库)  和 element 组件库（饿了么组件库）的
    }

    if (title) {
      // 到 title
      // 这个插槽渲染了一个 title, 是在 MenuItem 里面

      // 这样的语法是 js 的 插语法，可以在代码内写结构
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
