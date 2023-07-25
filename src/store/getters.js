// 将此全局子模块暴露出来,任意都可调用

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  // 当组件内访间全局的getters => username 时，
  // 就等于访问了user子模块中userInfo.username
  username: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.stafPhoto
}
export default getters
