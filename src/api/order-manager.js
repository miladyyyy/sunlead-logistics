import request from '@/utils/request'

export function searchOrderListAPI (data) {
  return request({
    method: 'POST',
    url: '/order-manager/order/page',
    data
  })
}
