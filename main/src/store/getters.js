const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  childRoutesName: state => state.tagsView.childRoutesName,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  uuid: state => state.user.uuid,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  menu: state => state.user.menu,
  permission_routes: state => state.permission.routes,
  allFullpaths: state => state.permission.allFullpaths,
  errorLogs: state => state.errorLog.logs
}
export default getters
