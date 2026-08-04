/**
 * 可选：在站点侧读取 content/news 下的 Markdown。
 * 用法（Next / Node）：
 *   import { loadMarkdownArticles } from '../news-generator-kit/src/markdown-loader'
 *   const posts = loadMarkdownArticles()
 *
 * 若内容目录不在本包内，传绝对路径：
 *   loadMarkdownArticles('/path/to/content/news')
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import matter from 'gray-matter'

import { BLOG_CATEGORIES } from './blog-categories.js'
import type { BlogArticle, BlogCategory, BlogCover, BlogFaq } from './article-types.js'

const DEFAULT_DIR = resolve(fileURLToPath(new URL('.', import.meta.url)), '../content/news')

interface NewFrontMatter {
  slug: string
  title: string
  summary: string
  category: BlogCategory
  tags: string[]
  publishedAt: string | Date
  updatedAt?: string | Date
  readingMinutes?: number
  faqs?: BlogFaq[]
  cover?: BlogCover
}

interface LegacyFrontMatter {
  title?: string
  date?: string
  excerpt?: string
  coverImage?: string
  tags?: string[] | string
  readTimeMinutes?: number
  slug?: string
}

function normalizeDate(v: string | Date | undefined, fallback: string): string {
  if (!v) return fallback
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  const s = String(v).trim()
  return s.length >= 10 ? s.slice(0, 10) : fallback
}

function estimateReadingMinutes(body: string): number {
  const chars = body.replace(/\s+/g, '').length
  return Math.max(3, Math.round(chars / 400))
}

function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.md$/, '')
  const m = base.match(/^\d{4}-\d{2}-\d{2}-(.+)$/)
  return m ? m[1] : base
}

function dateFromFilename(filename: string): string | null {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})-/)
  return m ? m[1] : null
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.filter((t): t is string => typeof t === 'string')
  if (typeof tags === 'string' && tags.trim()) return [tags]
  return []
}

function excerptFromContent(content: string, maxLen = 160): string {
  const plain = content
    .replace(/[#*`\[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  return plain.length > maxLen ? `${plain.slice(0, maxLen)}…` : plain
}

function parseLegacy(
  filename: string,
  data: LegacyFrontMatter,
  content: string
): BlogArticle | null {
  if (!data.title) return null
  const slug = data.slug || slugFromFilename(filename)
  const publishedAt = normalizeDate(
    data.date ? new Date(data.date) : undefined,
    dateFromFilename(filename) ?? '1970-01-01'
  )
  return {
    slug,
    title: data.title,
    summary: data.excerpt?.trim() || excerptFromContent(content),
    content: content.trim(),
    category: 'guide',
    tags: normalizeTags(data.tags),
    publishedAt,
    updatedAt: publishedAt,
    readingMinutes:
      typeof data.readTimeMinutes === 'number'
        ? data.readTimeMinutes
        : estimateReadingMinutes(content),
    faqs: [],
    coverImage: data.coverImage,
    source: 'markdown',
  }
}

function parseNewFormat(
  filename: string,
  data: NewFrontMatter,
  content: string
): BlogArticle | null {
  if (!data.slug || !data.title || !data.summary || !data.category) return null
  if (!(BLOG_CATEGORIES as string[]).includes(data.category)) return null
  const publishedAt = normalizeDate(data.publishedAt, dateFromFilename(filename) ?? '1970-01-01')
  const updatedAt = normalizeDate(data.updatedAt, publishedAt)
  return {
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    content: content.trim(),
    category: data.category,
    tags: normalizeTags(data.tags),
    publishedAt,
    updatedAt,
    readingMinutes:
      typeof data.readingMinutes === 'number'
        ? data.readingMinutes
        : estimateReadingMinutes(content),
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    ...(data.cover ? { cover: data.cover } : {}),
    source: 'markdown',
  }
}

function parseOne(filePath: string, filename: string): BlogArticle | null {
  if (filename === 'README.md') return null
  try {
    const raw = readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    if (data.summary && data.category) {
      return parseNewFormat(filename, data as NewFrontMatter, content)
    }
    return parseLegacy(filename, data as LegacyFrontMatter, content)
  } catch {
    return null
  }
}

export function loadMarkdownArticles(contentDir = DEFAULT_DIR): BlogArticle[] {
  let files: string[] = []
  try {
    files = readdirSync(contentDir).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }
  return files
    .map((f) => parseOne(join(contentDir, f), f))
    .filter((a): a is BlogArticle => a !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getArticleBySlug(
  slug: string,
  contentDir = DEFAULT_DIR
): BlogArticle | undefined {
  return loadMarkdownArticles(contentDir).find((a) => a.slug === slug)
}
