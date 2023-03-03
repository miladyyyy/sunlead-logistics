import request from '@/utils/request'

export function searchDriverListAPI (params) {
  return request({
    method: 'GET',
    url: '/driver/page',
    params
  })
}
export function getDriverInfoAPI (id) {
  return request({
    method: 'GET',
    url: `/driver/${id}`
  })
}
