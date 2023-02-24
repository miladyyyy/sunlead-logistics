import request from '@/utils/request'

export function getMenusAPI () {
  return request({
    method: 'GET',
    url: '/menus'
  })
}

export function getWorkspaceAPI () {
  return request({
    method: 'GET',
    url: '/workspace'
  })
}

// 获取地址信息
export function getAreasAPI () {
  return request({
    method: 'GET',
    url: '/areas/children'
  })
}

// 根据父id获取地址信息
export function getAreasByIdAPI (id) {
  return request({
    method: 'GET',
    url: '/areas/children',
    params: { parentId: id }
  })
}
