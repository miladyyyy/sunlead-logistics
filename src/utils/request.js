import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTime } from './storage'
import router from '@/router'

const expireTime = getTime()

function isExpired () {
  const currentTime = Date.now()
  const localTime = getTime()
  return currentTime - localTime > expireTime * 1000
}

const request = axios.create({
  baseURL: 'https://slwl-geteway-t.itheima.net/manager',
  timeout: 30000
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 判断token是否超时
  if (isExpired()) {
    Message.warning('登陆过期')
    store.dispatch('user/logoutAction')
    router.push('/login')
  }
  const { token } = store.state.user
  if (token) config.headers.Authorization = token

  return config
})

// 响应拦截器
request.interceptors.response.use(
  function (res) {
    if (res.data.code && res.data.code === 1) {
      Message.error(res.data.msg)
      return Promise.reject(new Error())
    }
    return res
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default request
