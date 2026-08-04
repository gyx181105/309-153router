# AI 新闻资讯生成工具包（可独立复制）

从 OptRouter 项目抽离的**选题 + 写稿 + 落盘 Markdown**流水线。复制到新站后，改品牌配置即可用。

## 它做什么

```text
npm run news:generate:daily
  → OpenAI Responses API + web_search 选题（近 14 天热点）
  → Chat Completions 写中文长文
  → Unsplash 封面（可选）
  → 写入 content/news/YYYY-MM-DD-slug.md
  → 钉钉播报（可选）
```

**不是** RSS/爬虫抓列表；是 LLM 根据品牌方向生成文章。站点只要能读本地 Markdown 就能展示。

## 快速开始

```bash
# 1. 复制整个 news-generator-kit 目录到你的新项目（可改名）
cp -r news-generator-kit /path/to/your-site/news

# 2. 安装依赖
cd /path/to/your-site/news
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env：至少填 OPENAI_API_KEY

# 4. 改品牌（必改）
# 编辑 src/brand.ts

# 5. 试跑
npm run news:generate -- --auto
npm run news:generate -- --topic "你的选题"
npm run news:generate -- --auto --dry-run   # 只预览不写文件
```

## 目录结构

```text
news-generator-kit/
  README.md                 ← 本说明
  package.json
  tsconfig.json
  .env.example
  scripts/
    generate-article.ts     ← 主入口
    daily-news-cron.sh      ← Linux 每日定时
  src/
    brand.ts                ← 【必改】品牌名、受众、关键词、兜底选题
    article-types.ts
    blog-categories.ts      ← 分类与 Unsplash 搜索词
    unsplash.ts
    dingtalk.ts             ← 可选钉钉播报
    site-url.ts             ← 文章预览链接用
    markdown-loader.ts      ← 可选：站点读取 md 列表
  content/news/             ← 生成结果目录
    example-post.md
  templates/
    next-receive-route.ts   ← 可选：Next.js 接收外部推送的 API
    INTEGRATE.md            ← 接到新站博客页的建议
```

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `OPENAI_API_KEY` | 是 | OpenAI 兼容 API Key |
| `OPENAI_BASE_URL` | 否 | 自定义网关，如 `https://api.optrouter.com/v1` |
| `OPENAI_MODEL` | 否 | 写稿模型，默认 `gpt-4o-mini` |
| `OPENAI_DISCOVERY_MODEL` | 否 | 选题模型，默认 `gpt-4o`（需支持 web_search） |
| `UNSPLASH_ACCESS_KEY` | 否 | 封面图 |
| `HTTP_PROXY` / `HTTPS_PROXY` | 否 | 本机代理 |
| `NEXT_PUBLIC_SITE_URL` | 否 | 钉钉/预览链接用，如 `https://example.com` |
| `DINGTALK_NEWS_*` | 否 | 生成成功后钉钉播报 |
| `NEWS_CRON_GIT_PUSH` | 否 | cron 脚本里设为 `1` 则自动 git commit/push |
| `NEXT_REBUILD_HOOK_URL` | 否 | 生成后触发部署 hook |
| `RECEIVE_API_KEY` | 否 | 仅当使用 `templates/next-receive-route.ts` 时 |

## npm 脚本

```bash
npm run news:generate -- --topic "多模型路由中的 Fallback 策略"
npm run news:generate -- --auto
npm run news:generate -- --auto --category routing
npm run news:generate:daily    # 等同 --auto，给 cron 用
```

## 定时任务（Linux）

```bash
chmod +x scripts/daily-news-cron.sh
# crontab -e
0 7 * * * /绝对路径/news-generator-kit/scripts/daily-news-cron.sh
```

## 接到新站

见 [`templates/INTEGRATE.md`](templates/INTEGRATE.md)。两种常见接法：

1. **同仓库**：生成写到本包 `content/news/`，博客页用 `markdown-loader` 读，或把输出目录改成新站的 `content/blog`。
2. **推送到站**：生成后 git push，或调用新站的 `POST /api/news/receive`。

## 文章 frontmatter 格式

生成器写入的新格式示例：

```yaml
---
slug: multi-model-fallback
title: 多模型路由中的 Fallback 策略
summary: 80-200 字摘要
category: routing
tags: ["智能路由", "Fallback"]
publishedAt: "2026-07-29"
updatedAt: "2026-07-29"
readingMinutes: 5
faqs:
  - question: "..."
    answer: "..."
cover:
  url: "https://images.unsplash.com/..."
  photographer: "..."
---

## 正文从二级标题开始
...
```

## 注意

- 选题依赖模型的 **web_search**；若网关不支持，会自动落到 `brand.ts` 的 `FALLBACK_TOPICS`。
- 写稿与选题可走任意 OpenAI 兼容 `baseURL`（含自建网关）。
- 本包不含完整博客 UI；只含生成与读取。UI 请用新站自己的页面。
