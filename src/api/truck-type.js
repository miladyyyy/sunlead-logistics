import request from '@/utils/request'

// export function getTruckTypeListAPI (params) {
//   return request({
//     method: 'GET',
//     url: '/truckType/page',
//     params
//   })
// }

export function addTruckTypeAPI (data) {
  return request({
    method: 'POST',
    url: '/truckType',
    data
  })
}

export function searchTruckTypeAPI (params) {
  for (const key in params) {
    if (params[key] === '') delete params[key]
  }

  return request({
    method: 'GET',
    url: '/truckType/page',
    params
  })
}

export function getTrukTypeAPI () {
  return request({
    method: 'GET',
    url: '/truckType/simple'
  })
}
