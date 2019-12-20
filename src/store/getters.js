const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  theme: state => state.app.theme,
  showSettings: state => state.app.showSettings,
  tagsView: state => state.app.tagsView,
  fixedHeader: state => state.app.fixedHeader,
  sidebarLogo: state => state.app.sidebarLogo,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userinfo: state => state.user.userinfo,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
