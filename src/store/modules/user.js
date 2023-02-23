import {
  getToken,
  setToken,
  removeToken,
  setTime
} from '@/utils/storage'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    user: {},
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

    handleLogin (state, data) {
      state.token = data.token.token
      state.expire = data.token.expire
      state.user = data.user
      setToken(data.token.token)
      setTime(Date.now())
    },
    setMenu (state, menu) {
      state.menu = menu
    }

  },
  actions: {
    logoutAction (contex) {
      contex.commit('removeToken')
    }
  }
}
