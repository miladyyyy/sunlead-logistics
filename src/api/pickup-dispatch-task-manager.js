import request from '@/utils/request'

export function searchPickUpTaskListAPI (data) {
  return request({
    method: 'POST',
    url: '/pickup-dispatch-task-manager/page',
    data
  })
}
