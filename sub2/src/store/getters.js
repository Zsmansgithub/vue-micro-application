const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  menu: state => state.user.menu,
  name: state => state.user.name,
  appName: state => state.user.appName,
  uuid: state => state.user.uuid
}
export default getters
