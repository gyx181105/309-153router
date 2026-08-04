/**
 * 【必改】品牌与选题方向 —— 复制到新站后先改这里
 */

export const BRAND = {
  name: 'YourBrand',
  productLine: '你的产品线一句话',
  audience: '开发者 / 技术负责人',
  positioning:
    '用一两句话说明产品定位，供选题与写稿 prompt 使用。',
} as const

/** 选题与关联方向关键词 */
export const BRAND_KEYWORDS: string[] = [
  'LLM API',
  'OpenAI 兼容',
  '多模型路由',
  'AI 成本优化',
  // 按你的新产品继续追加
]

/** 联网选题失败时的兜底池（按日期轮换） */
export const FALLBACK_TOPICS: {
  topic: string
  category: 'guide' | 'deep-dive' | 'compare' | 'routing' | 'product'
}[] = [
  { topic: '如何用统一 API 接入多个 LLM 供应商', category: 'guide' },
  { topic: '多模型路由中的 Fallback 策略设计', category: 'routing' },
  { topic: '主流大模型 API 选型对比思路', category: 'compare' },
  { topic: 'AI 网关中的 Token 用量与成本监控实践', category: 'deep-dive' },
  { topic: '从直连 OpenAI 迁移到 API 网关的步骤', category: 'guide' },
]
