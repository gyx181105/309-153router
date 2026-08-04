/** 站点 URL —— 钉钉播报与预览链接用 */

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || ''
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return 'http://localhost:3000'
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${p}`
}
