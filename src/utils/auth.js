import Cookies from 'js-cookie'

// 设定一个独一无二的key
const TokenKey = 'hr_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
} 

export function removeToken() {
  return Cookies.remove(TokenKey)
}
