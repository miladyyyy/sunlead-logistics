import request from '@/utils/request'

export function searchWorkScheListAPI (params) {
  return request({
    method: 'GET',
    url: '/work-schedulings',
    params
  })
}

export function updateWorkScheAPI (data) {
  return request({
    method: 'PUT',
    url: '/work-schedulings',
    data
  })
}
