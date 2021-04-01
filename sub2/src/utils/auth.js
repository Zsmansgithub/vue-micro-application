import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // return 'x28u3xus30ydj2zhw8jfncfha0ex63u4'
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
