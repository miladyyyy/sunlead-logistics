import request from '@/utils/request'

export function searchTruckListAPI (params) {
  return request({
    method: 'GET',
    url: '/truck/page',
    params
  })
}

export function addTruckListAPI (data) {
  return request({
    method: 'POST',
    url: '/truck',
    data
  })
}

export function getCountAPI () {
  return request({
    method: 'GET',
    url: '/count'
  })
}

export function getTruckDetailAPI (id) {
  return request({
    method: 'GET',
    url: `/truck/${id}`,
    id
  })
}
