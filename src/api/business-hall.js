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

export function getScopeAPI (id) {
  return request({
    method: 'GET',
    url: `/business-hall/scope/${id}/1`
  })
}

export function updateScopeAPI (data) {
  return request({
    method: 'POST',
    url: '/business-hall/courier/scope',
    data
  })
}

export function getCourierScopeAPI (id) {
  return request({
    method: 'GET',
    url: `/business-hall/scope/${id}/2`
  })
}
