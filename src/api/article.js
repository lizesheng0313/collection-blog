import request from '../utils/request';

// 获取文章列表
export function getArticleList(params) {
  return request.get('/api/articles/list', { params });
}

// 获取文章详情
export function getArticleDetail(id) {
  return request.get(`/api/articles/detail/${id}?no_read=1`);
} 