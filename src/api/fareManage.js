import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/fareRepertory/list',
    method: 'post',
    data: qs.stringify(query)
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function savePurchaser(data) {
  return request({
    url: '/api/purchaser/save',
    method: 'post',
    data: qs.stringify(data)
  })
}
