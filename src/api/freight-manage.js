import request from '@/utils/request'

export function getAddTempAPI () {
  return request({
    method: 'GET',
    url: '/carriages'
  })
}

export function addTempAPI (data) {
  return request({
    method: 'POST',
    url: '/carriages',
    data
  })
}

export function delTempAPI (id) {
  return request({
    method: 'DELETE',
    url: `/carriages/${id}`
  })
}
