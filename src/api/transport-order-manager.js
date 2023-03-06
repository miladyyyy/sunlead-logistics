import request from '@/utils/request'

export function searchTransportOrderListAPI (data) {
  return request({
    method: 'POST',
    url: '/transport-order-manager/page',
    data
  })
}

export function getCountAPI () {
  return request({
    method: 'GET',
    url: '/transport-order-manager/count'
  })
}
