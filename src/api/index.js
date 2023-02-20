import request from '@/utils/request'

export function getMenusAPI () {
  return request({
    method: 'GET',
    url: '/menus'
  })
}
