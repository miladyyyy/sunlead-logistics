import request from '@/utils/request'

export function searchTransportLineListAPI (data) {
  return request({
    method: 'POST',
    url: '/transportLine/page',
    data
  })
}

export function getTripsByIdAPI (params) {
  return request({
    method: 'GET',
    url: '/transportLine/trips',
    params
  })
}

export function addTransportLineAPI (data) {
  return request({
    method: 'POST',
    url: '/transportLine',
    data
  })
}

export function getTransportLineDetailAPI (id) {
  return request({
    method: 'GET',
    url: `/transportLine/${id}`
  })
}
