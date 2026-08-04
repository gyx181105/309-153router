# 接到新站的建议

## 方案 A：同仓库内生成 + 本站读 Markdown（最常见）

1. 把 `news-generator-kit` 拷到新站根目录（或 `tools/news`）。
2. 改 `src/brand.ts`、配 `.env`。
3. 博客列表页：

```ts
import { loadMarkdownArticles } from '../news-generator-kit/src/markdown-loader'

export default function BlogPage() {
  const posts = loadMarkdownArticles()
  // 渲染 posts
}
```

若希望文章直接写到新站自己的目录（例如 `content/blog`），可改 `scripts/generate-article.ts` 里的：

```ts
const CONTENT_DIR = resolve(KIT_ROOT, 'content/news')
// 改成：
const CONTENT_DIR = resolve(KIT_ROOT, '../content/blog')
```

或设置环境变量后自行扩展脚本。

## 方案 B：本机/服务器生成，推送到新站 API

1. 新站实现接收接口（可参考 `next-receive-route.ts`）。
2. 生成后用 curl 推送：

```bash
curl -X POST https://新站域名/api/news/receive \
  -H "x-api-key: YOUR_KEY" \
  -F "files=@content/news/2026-07-29-xxx.md"
```

## 方案 C：生成后 git push，新站部署时拉仓库

在 `.env` 设：

```bash
NEWS_CRON_GIT_PUSH=1
NEXT_REBUILD_HOOK_URL=https://...   # Vercel Deploy Hook 等
```

配合 `scripts/daily-news-cron.sh` 即可。

## 展示层注意

- 封面可能是 Unsplash 外链（`cover.url`），也支持旧字段 `coverImage`（本地 `/news/xxx.png`）。
- 详情路由建议：`/blog/[slug]`，与钉钉播报默认路径一致；若用多语言前缀，改 `dingtalk.ts` 的 `pathPrefix`。
- 本包不包含 UI / i18n；列表、详情、SEO 用新站自己的组件。
