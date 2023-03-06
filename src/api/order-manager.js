import request from '@/utils/request'

export function searchOrderListAPI (data) {
  return request({
    method: 'POST',
    url: '/order-manager/order/page',
    data
  })
}
export function getOrderDetailAPI (id) {
  return request({
    method: 'GET',
    url: `/order-manager/order/${id}`
  })
}
