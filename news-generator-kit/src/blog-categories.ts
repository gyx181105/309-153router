import type { BlogCategory } from './article-types.js'

export const BLOG_CATEGORIES: BlogCategory[] = [
  'guide',
  'deep-dive',
  'compare',
  'routing',
  'product',
]

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  guide: '实践指南',
  'deep-dive': '技术深读',
  compare: '选型对比',
  routing: '智能路由',
  product: '产品动态',
}

export const BLOG_CATEGORY_DESCRIPTIONS: Record<BlogCategory, string> = {
  guide: '接入、集成与开发者最佳实践。',
  'deep-dive': '架构与技术细节。',
  compare: '方案与供应商对比。',
  routing: '路由、容灾与负载策略。',
  product: '产品更新与功能发布。',
}

export const BLOG_CATEGORY_UNSPLASH_QUERIES: Record<BlogCategory, string> = {
  guide: 'developer code abstract',
  'deep-dive': 'server network abstract technology',
  compare: 'data analytics dashboard',
  routing: 'circuit technology blue abstract',
  product: 'cloud software minimal',
}

export function getBlogCategoryLabel(category: BlogCategory) {
  return BLOG_CATEGORY_LABELS[category]
}
