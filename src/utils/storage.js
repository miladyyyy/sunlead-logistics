import Cookies from 'js-cookie'
const tokenKey = 'my-token'
const timeKey = 'time-key'
const userKey = 'USER'

export function getToken () {
  return Cookies.get(tokenKey)
}

export function setToken (newToken) {
  Cookies.set(tokenKey, newToken)
}

export function removeToken () {
  Cookies.remove(tokenKey)
}

export function setTime () {
  Cookies.set(timeKey, Date.now())
}

export function getTime () {
  return Cookies.get(timeKey)
}

export function setUser (user) {
  localStorage.setItem(userKey, JSON.stringify(user))
}

export function getUser () {
  let user
  try {
    user = JSON.parse(localStorage.getItem(userKey))
  } catch (error) {

  }
  return user
}

export function removeUser () {
  localStorage.removeItem(userKey)
}

// export function setMenu (menu) {
//   Cookies.set(menuKey, JSON.stringify(menu))
// }

// export function getMenu () {
//   return JSON.parse(Cookies.get(menuKey) || '[]')
// }

// export function removeMenu () {
//   Cookies.remove(menuKey)
// }
