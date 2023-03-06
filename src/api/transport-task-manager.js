import request from '@/utils/request'

export function searchTransportTaskListAPI (data) {
  return request({
    method: 'POST',
    url: 'transport-task-manager/page',
    data
  })
}

export function getCountAPI () {
  return request({
    method: 'GET',
    url: '/transport-task-manager/count'
  })
}
