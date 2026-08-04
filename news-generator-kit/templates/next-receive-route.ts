/**
 * Next.js App Router 接收推送模板
 *
 * 用法：复制到你的项目
 *   app/api/news/receive/route.ts
 *
 * 环境变量：RECEIVE_API_KEY
 *
 * 示例：
 *   curl -X POST https://你的域名/api/news/receive \
 *     -H "x-api-key: YOUR_KEY" \
 *     -F "files=@article.md" \
 *     -F "files=@cover.png"
 *
 * 注意：按你的仓库结构调整 CONTENT_DIR / PUBLIC_DIR。
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONFIG = {
  apiKeyEnvName: 'RECEIVE_API_KEY',
  contentDir: 'content/news',
  publicDir: 'public/news',
  docExtensions: ['.md'],
  imageExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'],
}

const CONTENT_DIR = path.join(process.cwd(), CONFIG.contentDir)
const PUBLIC_DIR = path.join(process.cwd(), CONFIG.publicDir)

function getApiKey(): string | undefined {
  return process.env[CONFIG.apiKeyEnvName]
}

function validateApiKey(request: NextRequest): boolean {
  const apiKey =
    request.headers.get('x-api-key') ||
    request.headers.get('authorization')?.replace('Bearer ', '')
  const expectedKey = getApiKey()
  return !!expectedKey && apiKey === expectedKey
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json({ success: false, message: '无效的 API Key' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    if (!files?.length) {
      return NextResponse.json(
        { success: false, message: '没有收到文件，请用 files 字段上传' },
        { status: 400 }
      )
    }

    const results: { name: string; saved: boolean; dest?: string; error?: string }[] = []

    for (const file of files) {
      const fileName = file.name
      const ext = path.extname(fileName).toLowerCase()
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        if (CONFIG.docExtensions.includes(ext)) {
          ensureDir(CONTENT_DIR)
          const dest = path.join(CONTENT_DIR, fileName)
          fs.writeFileSync(dest, buffer)
          // 可选：校验 frontmatter
          try {
            matter(buffer.toString('utf8'))
          } catch {
            /* ignore */
          }
          results.push({ name: fileName, saved: true, dest: `${CONFIG.contentDir}/${fileName}` })
        } else if (CONFIG.imageExtensions.includes(ext)) {
          ensureDir(PUBLIC_DIR)
          const dest = path.join(PUBLIC_DIR, fileName)
          fs.writeFileSync(dest, buffer)
          results.push({ name: fileName, saved: true, dest: `${CONFIG.publicDir}/${fileName}` })
        } else {
          results.push({ name: fileName, saved: false, error: `不支持的文件类型: ${ext}` })
        }
      } catch (error) {
        results.push({
          name: fileName,
          saved: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    const saved = results.filter((r) => r.saved).length
    return NextResponse.json({
      success: true,
      message: `接收完成：成功 ${saved} 个`,
      data: { details: results },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : '接收失败' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/news/receive',
    description: '上传 .md 和图片到 content/news 与 public/news',
  })
}
