import request from '@/utils/request'

// 获取评论列表
export function getComments(params) {
  return request({
    url: '/api/comments',
    method: 'get',
    params
  })
}

// 提交评论
export function submitComment(data) {
  return request({
    url: '/api/comments',
    method: 'post',
    data
  })
}

// 点赞评论
export function likeComment(commentId) {
  return request({
    url: `/api/comments/${commentId}/like`,
    method: 'post'
  })
}

// 获取评论详情
export function getCommentDetail(commentId) {
  return request({
    url: `/api/comments/${commentId}`,
    method: 'get'
  })
}

// 回复评论
export function replyComment(commentId, data) {
  return request({
    url: `/api/comments/${commentId}/reply`,
    method: 'post',
    data
  })
}
