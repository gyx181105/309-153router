export type DocsSlug =
  | 'introduction'
  | 'quickstart'
  | 'api-key'
  | 'authentication'
  | 'openai-sdk'
  | 'chat-completions'
  | 'models'
  | 'smart-routing-models'
  | 'streaming'
  | 'request-params'
  | 'response'
  | 'smart-routing'
  | 'failover'
  | 'logs-headers'
  | 'errors'
  | 'insufficient-balance'
  | 'rate-limits'
  | 'faq'

export type DocsNavGroup = {
  id: string
  labelKey: string
  items: { slug: DocsSlug; labelKey: string }[]
}

export const DOCS_NAV: DocsNavGroup[] = [
  {
    id: 'getting-started',
    labelKey: 'docsSite.nav.gettingStarted',
    items: [
      { slug: 'introduction', labelKey: 'docsSite.nav.introduction' },
      { slug: 'quickstart', labelKey: 'docsSite.nav.quickstart' },
      { slug: 'api-key', labelKey: 'docsSite.nav.apiKey' },
      { slug: 'authentication', labelKey: 'docsSite.nav.authentication' },
      { slug: 'openai-sdk', labelKey: 'docsSite.nav.openaiSdk' },
    ],
  },
  {
    id: 'api',
    labelKey: 'docsSite.nav.api',
    items: [
      { slug: 'chat-completions', labelKey: 'docsSite.nav.chatCompletions' },
      { slug: 'models', labelKey: 'docsSite.nav.models' },
      { slug: 'smart-routing-models', labelKey: 'docsSite.nav.smartRoutingModels' },
      { slug: 'streaming', labelKey: 'docsSite.nav.streaming' },
      { slug: 'request-params', labelKey: 'docsSite.nav.requestParams' },
      { slug: 'response', labelKey: 'docsSite.nav.response' },
    ],
  },
  {
    id: 'gateway',
    labelKey: 'docsSite.nav.gateway',
    items: [
      { slug: 'smart-routing', labelKey: 'docsSite.nav.smartRouting' },
      { slug: 'failover', labelKey: 'docsSite.nav.failover' },
      { slug: 'logs-headers', labelKey: 'docsSite.nav.logsHeaders' },
    ],
  },
  {
    id: 'troubleshooting',
    labelKey: 'docsSite.nav.troubleshooting',
    items: [
      { slug: 'errors', labelKey: 'docsSite.nav.errors' },
      { slug: 'insufficient-balance', labelKey: 'docsSite.nav.insufficientBalance' },
      { slug: 'rate-limits', labelKey: 'docsSite.nav.rateLimits' },
      { slug: 'faq', labelKey: 'docsSite.nav.faq' },
    ],
  },
]

export const DOCS_SLUGS: DocsSlug[] = DOCS_NAV.flatMap((g) => g.items.map((i) => i.slug))

export const DEFAULT_DOCS_SLUG: DocsSlug = 'quickstart'

export function isDocsSlug(value: string): value is DocsSlug {
  return (DOCS_SLUGS as string[]).includes(value)
}
