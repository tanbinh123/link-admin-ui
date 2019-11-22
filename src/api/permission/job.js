import request from '@/utils/request'

export function jobList(data) {
  return request({
    url: '/rest/job/list',
    method: 'post',
    data
  })
}

export function jobs() {
  return request({
    url: '/rest/job/all',
    method: 'get'
  })
}

export function addJob(data) {
  return request({
    url: '/rest/job/add',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: `/rest/job/update`,
    method: 'post',
    data
  })
}

export function updateState(data) {
  return request({
    url: `/rest/job/updateState`,
    method: 'post',
    data
  })
}

export function deleteJob(id) {
  return request({
    url: `/rest/job/delete`,
    method: 'get',
    params: { id }
  })
}
