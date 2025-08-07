import request from '@/utils/request'

/**
 * 获取GitHub项目列表
 */
export const getGitHubProjects = (params) => {
  return request({
    url: '/api/articles/github',
    method: 'get',
    params
  })
}

/**
 * 获取GitHub项目详情
 */
export const getGitHubProjectDetail = (owner, repo) => {
  return request({
    url: `/api/articles/github/${owner}/${repo}`,
    method: 'get'
  })
}

/**
 * 获取编程语言统计
 */
export const getLanguageStats = () => {
  return request({
    url: '/api/articles/github/languages',
    method: 'get'
  })
}

/**
 * 获取评分分布统计
 */
export const getScoreStats = () => {
  return request({
    url: '/api/articles/github/scores',
    method: 'get'
  })
}

/**
 * 获取热门项目
 */
export const getTrendingProjects = (params) => {
  return request({
    url: '/api/github/trending',
    method: 'get',
    params
  })
}