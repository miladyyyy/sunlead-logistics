import request from '@/utils/request'

export function getWorkPatternsAPI () {
  return request({
    method: 'GET',
    url: '/work-patterns/all'
  })
}

export function getWorkPattListAPI (params) {
  return request({
    method: 'GET',
    url: '/work-patterns/page',
    params
  })
}
