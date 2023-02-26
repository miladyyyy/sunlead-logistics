import request from '@/utils/request'

export function searchTruckReturnListAPI (data) {
  return request({
    method: 'POST',
    url: 'truck-return-register/pageQuery',
    data
  })
}
