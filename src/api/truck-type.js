import request from '@/utils/request'

export function getTruckTypeListAPI (params) {
  return request({
    method: 'GET',
    url: '/truckType/page',
    params
  })
}
