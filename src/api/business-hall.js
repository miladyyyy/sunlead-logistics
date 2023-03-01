import request from '@/utils/request'

export function getOrgTreeAPI () {
  return request({
    method: 'GET',
    url: '/business-hall/tree'
  })
}

export function getOrgDetailAPI (id) {
  return request({
    method: 'GET',
    url: `/business-hall/${id}`
  })
}

export function getEmployeeListAPI (params) {
  return request({
    method: 'GET',
    url: '/business-hall/user/page',
    params
  })
}
export function searchCourierListAPI (params) {
  return request({
    method: 'GET',
    url: '/business-hall/courier/page',
    params
  })
}
