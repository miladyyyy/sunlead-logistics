import request from '@/utils/request'

export function getCaptchaAPI (hash) {
  return request({
    method: 'GET',
    url: `/captcha?key=${hash}`,
    responseType: 'blob'
  })
}

export function loginAPI (data) {
  return request({
    method: 'POST',
    url: '/login',
    data
  })
}
