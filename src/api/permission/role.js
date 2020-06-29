import request from '@/utils/request'

export function roleList(data) {
  return request({
    url: '/rest/role/list',
    method: 'post',
    data
  })
}

export function roles() {
  return request({
    url: '/rest/role/all',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/rest/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/rest/role/update`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/rest/role/delete`,
    method: 'get',
    params: { id }
  })
}

export function saveDataScope(data) {
  return request({
    url: `/rest/role/saveDataScope`,
    method: 'post',
    data
  })
}

export function queryDataScope(id) {
  return request({
    url: `/rest/role/queryDataScope`,
    method: 'get',
    params: { id }
  })
}

export function updateState(data) {
  return request({
    url: `/rest/role/updateState`,
    method: 'post',
    data
  })
}