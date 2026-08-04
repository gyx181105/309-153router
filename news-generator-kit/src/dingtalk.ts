import crypto from 'node:crypto'

import type { BlogCategory } from './article-types.js'
import { getBlogCategoryLabel } from './blog-categories.js'
import { BRAND } from './brand.js'
import { absoluteUrl, getSiteUrl } from './site-url.js'

/**
 * 可选：生成成功后钉钉播报
 *
 * DINGTALK_NEWS_ENABLED=true
 * DINGTALK_NEWS_WEBHOOK_URL=...
 * DINGTALK_NEWS_SECRET=SEC...
 */

export type NewsPublishedNotifyInput = {
  title: string
  slug: string
  category: BlogCategory
  tags?: string[]
  publishedAt?: string | Date
  /** 文章路径前缀，默认 /blog */
  pathPrefix?: string
}

function isNewsDingTalkEnabled(): boolean {
  const explicit = process.env.DINGTALK_NEWS_ENABLED
  if (explicit === 'false' || explicit === '0') return false
  if (explicit === 'true' || explicit === '1') return true
  return Boolean(
    process.env.DINGTALK_NEWS_WEBHOOK_URL?.trim() &&
      process.env.DINGTALK_NEWS_SECRET?.trim()
  )
}

export function isNewsDingTalkConfigured(): boolean {
  return (
    isNewsDingTalkEnabled() &&
    Boolean(process.env.DINGTALK_NEWS_WEBHOOK_URL?.trim()) &&
    Boolean(process.env.DINGTALK_NEWS_SECRET?.trim())
  )
}

function buildSignedWebhookUrl(webhookUrl: string, secret: string): string {
  const timestamp = Date.now()
  const sign = encodeURIComponent(
    crypto.createHmac('sha256', secret).update(`${timestamp}\n${secret}`).digest('base64')
  )
  const separator = webhookUrl.includes('?') ? '&' : '?'
  return `${webhookUrl}${separator}timestamp=${timestamp}&sign=${sign}`
}

function getNewsWebhookUrl(): string | null {
  if (!isNewsDingTalkEnabled()) return null

  const url = process.env.DINGTALK_NEWS_WEBHOOK_URL?.trim()
  if (!url) {
    console.warn('⚠️ 新闻钉钉：已启用但未配置 DINGTALK_NEWS_WEBHOOK_URL')
    return null
  }

  const secret = process.env.DINGTALK_NEWS_SECRET?.trim()
  if (!secret) {
    console.warn('⚠️ 新闻钉钉：未配置 DINGTALK_NEWS_SECRET（加签机器人必填）')
    return null
  }

  return buildSignedWebhookUrl(url, secret)
}

export function formatNewsNotifyTime(date = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date instanceof Date ? date : new Date(date))
}

export function formatNewsPublishedText(input: NewsPublishedNotifyInput): string {
  const host = new URL(getSiteUrl()).host
  const categoryLabel = getBlogCategoryLabel(input.category)
  const tags = (input.tags ?? []).filter(Boolean)
  const source =
    tags.length > 0
      ? `AI 自动生成 · ${categoryLabel} · ${tags.join('、')}`
      : `AI 自动生成 · ${categoryLabel}`
  const publishedAt = input.publishedAt ?? new Date()
  const prefix = input.pathPrefix ?? '/blog'
  const header = `✅ 新闻生成完成！(${host} - ${BRAND.name})`

  return [
    header,
    `标题： ${input.title.trim()}`,
    `来源： ${source}`,
    `时间： ${formatNewsNotifyTime(publishedAt)}`,
    `链接： ${absoluteUrl(`${prefix}/${input.slug}`)}`,
  ].join('\n')
}

async function sendNewsDingTalkText(content: string): Promise<boolean> {
  const webhookUrl = getNewsWebhookUrl()
  if (!webhookUrl) return false

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'text',
        text: { content },
      }),
    })

    const json = (await res.json().catch(() => ({}))) as {
      errcode?: number
      errmsg?: string
    }

    if (!res.ok || (json.errcode !== undefined && json.errcode !== 0)) {
      console.error('❌ 新闻钉钉发送失败:', json.errcode, json.errmsg ?? res.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('❌ 新闻钉钉请求异常:', error instanceof Error ? error.message : error)
    return false
  }
}

export async function notifyNewsPublished(
  input: NewsPublishedNotifyInput
): Promise<boolean> {
  return sendNewsDingTalkText(formatNewsPublishedText(input))
}
