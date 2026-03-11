全部完成，共做了 4 项 SEO 优化：

1. 根 layout.tsx — 全站基础 SEO

metadataBase 指向 https://optrouter.com
Title template：子页面自动拼接 | OptRouter
20 个精准关键词（AI API、LLM 网关、OpenAI 兼容等）
Open Graph + Twitter Card（大图预览，分享到微信/X 效果好）
robots 指令：允许 Google 完整抓取和索引
2. 首页 page.tsx — JSON-LD 结构化数据

Organization 品牌信息
WebSite + SearchAction
SoftwareApplication（应用详情、功能列表、价格）
FAQPage（4 条 FAQ，可在 Google 搜索结果直接展开）
3. 招商页 promo layout.tsx — 专属 metadata

独立标题和描述，针对"代理赚钱/AI 推广分佣"关键词优化
独立 OG 图（og-promo.png）和 canonical URL
4. sitemap.ts + robots.ts

自动生成 /sitemap.xml，标注各页面优先级和更新频率
/robots.txt 开放首页/登录/招商页，屏蔽后台和 API 路径
建议：准备一张 1200×630 的 og-image.png（首页用）和 og-promo.png（招商页用），放到 web/public/ 目录下，分享效果会更好。