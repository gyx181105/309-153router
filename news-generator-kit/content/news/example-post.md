---
slug: example-getting-started
title: "示例文章：快速开始"
summary: "这是一条示例 Markdown，方便你对照 frontmatter 格式。正式文章由 scripts/generate-article.ts 自动生成。"
category: guide
tags: ["示例", "快速开始"]
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
readingMinutes: 3
faqs:
  - question: "如何生成新文章？"
    answer: "在本目录上级执行 npm run news:generate -- --auto"
  - question: "如何改品牌？"
    answer: "编辑 src/brand.ts"
---

## 简介

复制本工具包后，先改 `src/brand.ts`，再配置 `.env` 中的 `OPENAI_API_KEY`。

## 生成命令

```bash
npm run news:generate -- --auto
```

生成文件会出现在本目录：`YYYY-MM-DD-slug.md`。
