import {
  getToken,
  setToken,
  removeToken,
  setTime,
  setUser,
  removeUser,
  getUser
} from '@/utils/storage'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    user: getUser(),
    expire: 0,
    menu: null
  },
  getters: {},
  mutations: {
    removeToken (state) {
      state.token = ''
      state.expire = 0
      removeToken()
    },
    removeUser (state) {
      state.user = {}
      removeUser()
    },
    handleLogin (state, data) {
      state.token = data.token.token
      state.expire = data.token.expire
      state.user = data.user
      setToken(data.token.token)
      setTime(Date.now())
      setUser(data.user)
    },
    setMenu (state, menu) {
      state.menu = menu
    }

  },
  actions: {
    logoutAction (contex) {
      contex.commit('removeToken')
      contex.commit('removeUser')
    }
  }
}
