'use client'

import { LocaleLink } from '@/components/locale-link'
import { useI18n } from '@/lib/i18n-context'
import { OPTROUTER_BASE_URL } from '@/lib/docs/constants'
import type { DocsSlug } from '@/lib/docs/nav'
import type { TocItem } from '@/app/[locale]/(docs)/components/docs-toc'
import { DocsCodeBlock } from '@/app/[locale]/(docs)/components/docs-code-block'
import {
  DocsArticle,
  DocsCallout,
  DocsH2,
  DocsH3,
  DocsInlineCode,
  DocsP,
  DocsTable,
  DocsUl,
} from '@/app/[locale]/(docs)/components/docs-article'

type PageProps = { slug: DocsSlug }

function usePageMeta(slug: DocsSlug) {
  const { t } = useI18n()
  return {
    title: t(`docsSite.pages.${slug}.title`),
    description: t(`docsSite.pages.${slug}.description`),
  }
}

function toc(items: TocItem[]): TocItem[] {
  return items
}

const curlChat = `curl ${OPTROUTER_BASE_URL}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPTROUTER_API_KEY" \\
  -d '{
    "model": "auto",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'`

const pythonSdk = `import os
from openai import OpenAI

client = OpenAI(
    base_url="${OPTROUTER_BASE_URL}",
    api_key=os.environ.get("OPTROUTER_API_KEY"),
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello"}],
)
print(response.choices[0].message.content)`

const jsSdk = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${OPTROUTER_BASE_URL}',
  apiKey: process.env.OPTROUTER_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Hello' }],
});
console.log(response.choices[0].message.content);`

const streamCurl = `curl ${OPTROUTER_BASE_URL}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPTROUTER_API_KEY" \\
  -N \\
  -d '{
    "model": "auto",
    "stream": true,
    "messages": [{"role": "user", "content": "Hello"}]
  }'`

const successJson = `{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "auto",
  "choices": [{
    "index": 0,
    "message": { "role": "assistant", "content": "你好！" },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 18,
    "total_tokens": 30
  }
}`

const errorJson = `{
  "error": {
    "message": "...",
    "type": "..."
  }
}`

export function DocsPageBody({ slug }: PageProps) {
  const { t } = useI18n()
  const meta = usePageMeta(slug)

  switch (slug) {
    case 'introduction':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'what', title: t('docsSite.pages.introduction.hWhat'), level: 2 },
            { id: 'who', title: t('docsSite.pages.introduction.hWho'), level: 2 },
            { id: 'next', title: t('docsSite.pages.introduction.hNext'), level: 2 },
          ])}
        >
          <DocsH2 id="what">{t('docsSite.pages.introduction.hWhat')}</DocsH2>
          <DocsP>{t('docsSite.pages.introduction.pWhat')}</DocsP>
          <DocsUl>
            <li>{t('docsSite.pages.introduction.b0')}</li>
            <li>{t('docsSite.pages.introduction.b1')}</li>
            <li>{t('docsSite.pages.introduction.b2')}</li>
          </DocsUl>
          <DocsH2 id="who">{t('docsSite.pages.introduction.hWho')}</DocsH2>
          <DocsP>{t('docsSite.pages.introduction.pWho')}</DocsP>
          <DocsH2 id="next">{t('docsSite.pages.introduction.hNext')}</DocsH2>
          <DocsP>
            <LocaleLink href="/docs/quickstart" className="underline">
              {t('docsSite.pages.introduction.linkQuickstart')}
            </LocaleLink>
          </DocsP>
        </DocsArticle>
      )

    case 'quickstart':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'base-url', title: t('docsSite.pages.quickstart.hBaseUrl'), level: 2 },
            { id: 'steps', title: t('docsSite.pages.quickstart.hSteps'), level: 2 },
            { id: 'curl', title: t('docsSite.pages.quickstart.hCurl'), level: 2 },
            { id: 'sdk', title: t('docsSite.pages.quickstart.hSdk'), level: 2 },
          ])}
        >
          <DocsH2 id="base-url">{t('docsSite.pages.quickstart.hBaseUrl')}</DocsH2>
          <DocsP>{t('docsSite.pages.quickstart.pBaseUrl')}</DocsP>
          <DocsCodeBlock code={OPTROUTER_BASE_URL} language="text" />
          <DocsH2 id="steps">{t('docsSite.pages.quickstart.hSteps')}</DocsH2>
          <DocsUl>
            <li>
              {t('docsSite.pages.quickstart.s0')}{' '}
              <LocaleLink href="/register" className="underline">
                {t('common.register')}
              </LocaleLink>
            </li>
            <li>
              {t('docsSite.pages.quickstart.s1')}
              <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <LocaleLink
                  href="/keys"
                  className="inline-flex w-fit items-center rounded-md px-3 py-1.5 text-[13px] font-semibold no-underline"
                  style={{
                    background: 'var(--color-button-primary-bg)',
                    color: 'var(--color-button-primary-text)',
                  }}
                >
                  {t('docsSite.pages.quickstart.ctaCreateKey')}
                </LocaleLink>
                <LocaleLink
                  href="/docs/api-key"
                  className="text-[13px] underline"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('docsSite.pages.quickstart.linkApiKeyDoc')}
                </LocaleLink>
              </div>
            </li>
            <li>{t('docsSite.pages.quickstart.s2')}</li>
          </DocsUl>
          <DocsH2 id="curl">{t('docsSite.pages.quickstart.hCurl')}</DocsH2>
          <DocsCodeBlock code={curlChat} language="bash" />
          <DocsH2 id="sdk">{t('docsSite.pages.quickstart.hSdk')}</DocsH2>
          <DocsH3 id="python">Python</DocsH3>
          <DocsCodeBlock code={pythonSdk} language="python" />
          <DocsH3 id="javascript">JavaScript</DocsH3>
          <DocsCodeBlock code={jsSdk} language="javascript" />
        </DocsArticle>
      )

    case 'api-key':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'create', title: t('docsSite.pages.api-key.hCreate'), level: 2 },
            { id: 'format', title: t('docsSite.pages.api-key.hFormat'), level: 2 },
            { id: 'security', title: t('docsSite.pages.api-key.hSecurity'), level: 2 },
          ])}
        >
          <DocsH2 id="create">{t('docsSite.pages.api-key.hCreate')}</DocsH2>
          <DocsP>{t('docsSite.pages.api-key.pCreate')}</DocsP>
          <DocsCallout>
            <LocaleLink href="/register" className="font-medium underline">
              {t('docsSite.pages.api-key.ctaRegister')}
            </LocaleLink>
            {' · '}
            <LocaleLink href="/login" className="font-medium underline">
              {t('docsSite.pages.api-key.ctaLogin')}
            </LocaleLink>
          </DocsCallout>
          <DocsH2 id="format">{t('docsSite.pages.api-key.hFormat')}</DocsH2>
          <DocsP>{t('docs.apiKeyCreateHint')}</DocsP>
          <DocsH2 id="security">{t('docsSite.pages.api-key.hSecurity')}</DocsH2>
          <DocsP>{t('docsSite.pages.api-key.pSecurity')}</DocsP>
        </DocsArticle>
      )

    case 'authentication':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'base', title: t('docsSite.pages.authentication.hBase'), level: 2 },
            { id: 'header', title: t('docsSite.pages.authentication.hHeader'), level: 2 },
          ])}
        >
          <DocsH2 id="base">{t('docsSite.pages.authentication.hBase')}</DocsH2>
          <DocsP>{t('docsSite.pages.authentication.pBase')}</DocsP>
          <DocsCodeBlock code={OPTROUTER_BASE_URL} language="text" />
          <DocsH2 id="header">{t('docsSite.pages.authentication.hHeader')}</DocsH2>
          <DocsP>{t('docs.authDesc')}</DocsP>
          <DocsCodeBlock code={`Authorization: Bearer sk-xxxxxxxxxxxxxxxx`} language="http" />
        </DocsArticle>
      )

    case 'openai-sdk':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'change', title: t('docsSite.pages.openai-sdk.hChange'), level: 2 },
            { id: 'python', title: 'Python', level: 2 },
            { id: 'js', title: 'JavaScript', level: 2 },
          ])}
        >
          <DocsH2 id="change">{t('docsSite.pages.openai-sdk.hChange')}</DocsH2>
          <DocsP>{t('docsSite.pages.openai-sdk.pChange')}</DocsP>
          <DocsUl>
            <li>
              <DocsInlineCode>base_url</DocsInlineCode> / <DocsInlineCode>baseURL</DocsInlineCode> →{' '}
              <DocsInlineCode>{OPTROUTER_BASE_URL}</DocsInlineCode>
            </li>
            <li>
              <DocsInlineCode>api_key</DocsInlineCode> → {t('docsSite.pages.openai-sdk.keyHint')}
            </li>
          </DocsUl>
          <DocsH2 id="python">Python</DocsH2>
          <DocsCodeBlock code={pythonSdk} language="python" />
          <DocsH2 id="js">JavaScript</DocsH2>
          <DocsCodeBlock code={jsSdk} language="javascript" />
        </DocsArticle>
      )

    case 'chat-completions':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'endpoint', title: t('docsSite.pages.chat-completions.hEndpoint'), level: 2 },
            { id: 'example', title: t('docsSite.pages.chat-completions.hExample'), level: 2 },
            { id: 'params', title: t('docsSite.pages.chat-completions.hParams'), level: 2 },
          ])}
        >
          <DocsH2 id="endpoint">{t('docsSite.pages.chat-completions.hEndpoint')}</DocsH2>
          <DocsP>
            <DocsInlineCode>POST {OPTROUTER_BASE_URL}/chat/completions</DocsInlineCode>
          </DocsP>
          <DocsH2 id="example">{t('docsSite.pages.chat-completions.hExample')}</DocsH2>
          <DocsCodeBlock code={curlChat} language="bash" />
          <DocsH2 id="params">{t('docsSite.pages.chat-completions.hParams')}</DocsH2>
          <DocsP>
            {t('docsSite.pages.chat-completions.seeAlso')}{' '}
            <LocaleLink href="/docs/request-params" className="underline">
              {t('docsSite.nav.requestParams')}
            </LocaleLink>
          </DocsP>
        </DocsArticle>
      )

    case 'models':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'list', title: t('docsSite.pages.models.hList'), level: 2 },
            { id: 'pricing', title: t('docsSite.pages.models.hPricing'), level: 2 },
          ])}
        >
          <DocsH2 id="list">{t('docsSite.pages.models.hList')}</DocsH2>
          <DocsP>{t('docs.getModels')}</DocsP>
          <DocsCodeBlock
            code={`curl ${OPTROUTER_BASE_URL}/models \\\n  -H "Authorization: Bearer $OPTROUTER_API_KEY"`}
            language="bash"
          />
          <DocsH2 id="pricing">{t('docsSite.pages.models.hPricing')}</DocsH2>
          <DocsP>{t('docsSite.pages.models.pPricing')}</DocsP>
          <DocsCodeBlock
            code={`GET ${OPTROUTER_BASE_URL}/models/{model}/pricing`}
            language="http"
          />
        </DocsArticle>
      )

    case 'smart-routing-models':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'tiers', title: t('docsSite.pages.smart-routing-models.hTiers'), level: 2 },
            { id: 'strategy', title: t('docsSite.pages.smart-routing-models.hStrategy'), level: 2 },
          ])}
        >
          <DocsH2 id="tiers">{t('docsSite.pages.smart-routing-models.hTiers')}</DocsH2>
          <DocsP>{t('docs.smartRoutingDesc')}</DocsP>
          <DocsTable
            headers={[t('docs.field'), t('docs.desc')]}
            rows={[
              [<DocsInlineCode key="e">eco</DocsInlineCode>, t('docs.eco')],
              [<DocsInlineCode key="b">balanced</DocsInlineCode>, t('docs.balanced')],
              [<DocsInlineCode key="p">premium</DocsInlineCode>, t('docs.premium')],
              [<DocsInlineCode key="c">code</DocsInlineCode>, t('docs.code')],
              [<DocsInlineCode key="r">reasoning</DocsInlineCode>, t('docs.reasoning')],
              [<DocsInlineCode key="l">longctx</DocsInlineCode>, t('docs.longctx')],
              [<DocsInlineCode key="a">auto</DocsInlineCode>, t('docs.auto')],
            ]}
          />
          <DocsH2 id="strategy">{t('docsSite.pages.smart-routing-models.hStrategy')}</DocsH2>
          <DocsP>{t('docs.strategyHint')}</DocsP>
        </DocsArticle>
      )

    case 'streaming':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'enable', title: t('docsSite.pages.streaming.hEnable'), level: 2 },
            { id: 'example', title: t('docsSite.pages.streaming.hExample'), level: 2 },
          ])}
        >
          <DocsH2 id="enable">{t('docsSite.pages.streaming.hEnable')}</DocsH2>
          <DocsP>{t('docs.streamDesc')}</DocsP>
          <DocsH2 id="example">{t('docsSite.pages.streaming.hExample')}</DocsH2>
          <DocsCodeBlock code={streamCurl} language="bash" />
        </DocsArticle>
      )

    case 'request-params':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([{ id: 'fields', title: t('docsSite.pages.request-params.hFields'), level: 2 }])}
        >
          <DocsH2 id="fields">{t('docsSite.pages.request-params.hFields')}</DocsH2>
          <DocsP>{t('docs.mainParams')}</DocsP>
          <DocsTable
            headers={[t('docs.field'), t('docs.type'), t('docs.required'), t('docs.desc')]}
            rows={[
              [<DocsInlineCode key="m">model</DocsInlineCode>, 'string', '✓', t('docs.modelDesc')],
              [<DocsInlineCode key="msg">messages</DocsInlineCode>, 'array', '✓', t('docs.messagesDesc')],
              [<DocsInlineCode key="s">stream</DocsInlineCode>, 'boolean', '', t('docs.streamDesc')],
              [<DocsInlineCode key="t">temperature</DocsInlineCode>, 'float', '', t('docs.tempDesc')],
              [<DocsInlineCode key="mt">max_tokens</DocsInlineCode>, 'integer', '', t('docs.maxTokensDesc')],
            ]}
          />
        </DocsArticle>
      )

    case 'response':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'success', title: t('docsSite.pages.response.hSuccess'), level: 2 },
            { id: 'headers', title: t('docsSite.pages.response.hHeaders'), level: 2 },
          ])}
        >
          <DocsH2 id="success">{t('docsSite.pages.response.hSuccess')}</DocsH2>
          <DocsP>{t('docs.successResponse')}</DocsP>
          <DocsCodeBlock code={successJson} language="json" />
          <DocsH2 id="headers">{t('docsSite.pages.response.hHeaders')}</DocsH2>
          <DocsP>
            <LocaleLink href="/docs/logs-headers" className="underline">
              {t('docsSite.nav.logsHeaders')}
            </LocaleLink>
          </DocsP>
        </DocsArticle>
      )

    case 'smart-routing':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'how', title: t('docsSite.pages.smart-routing.hHow'), level: 2 },
            { id: 'usage', title: t('docsSite.pages.smart-routing.hUsage'), level: 2 },
          ])}
        >
          <DocsH2 id="how">{t('docsSite.pages.smart-routing.hHow')}</DocsH2>
          <DocsP>{t('docsSite.pages.smart-routing.pHow')}</DocsP>
          <DocsH2 id="usage">{t('docsSite.pages.smart-routing.hUsage')}</DocsH2>
          <DocsP>
            {t('docsSite.pages.smart-routing.pUsage')}{' '}
            <LocaleLink href="/docs/smart-routing-models" className="underline">
              {t('docsSite.nav.smartRoutingModels')}
            </LocaleLink>
          </DocsP>
        </DocsArticle>
      )

    case 'failover':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'what', title: t('docsSite.pages.failover.hWhat'), level: 2 },
            { id: 'behavior', title: t('docsSite.pages.failover.hBehavior'), level: 2 },
          ])}
        >
          <DocsH2 id="what">{t('docsSite.pages.failover.hWhat')}</DocsH2>
          <DocsP>{t('docsSite.pages.failover.pWhat')}</DocsP>
          <DocsH2 id="behavior">{t('docsSite.pages.failover.hBehavior')}</DocsH2>
          <DocsP>{t('docsSite.pages.failover.pBehavior')}</DocsP>
        </DocsArticle>
      )

    case 'logs-headers':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'headers', title: t('docs.responseHeaders'), level: 2 },
            { id: 'logs', title: t('docsSite.pages.logs-headers.hLogs'), level: 2 },
          ])}
        >
          <DocsH2 id="headers">{t('docs.responseHeaders')}</DocsH2>
          <DocsTable
            headers={['Header', t('docs.desc')]}
            rows={[
              [<DocsInlineCode key="r">X-Request-Id</DocsInlineCode>, t('docs.requestIdHeader')],
              [<DocsInlineCode key="l">X-Model-Latency-Ms</DocsInlineCode>, t('docs.latencyHeader')],
              [<DocsInlineCode key="c">X-Cost-Yuan</DocsInlineCode>, t('docs.costHeader')],
            ]}
          />
          <DocsH2 id="logs">{t('docsSite.pages.logs-headers.hLogs')}</DocsH2>
          <DocsP>{t('docsSite.pages.logs-headers.pLogs')}</DocsP>
        </DocsArticle>
      )

    case 'errors':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'format', title: t('docs.errorFormat'), level: 2 },
            { id: 'codes', title: t('docs.errorCodes'), level: 2 },
          ])}
        >
          <DocsH2 id="format">{t('docs.errorFormat')}</DocsH2>
          <DocsP>{t('docs.errorFormatDesc')}</DocsP>
          <DocsCodeBlock code={errorJson} language="json" />
          <DocsH2 id="codes">{t('docs.errorCodes')}</DocsH2>
          <DocsTable
            headers={[t('docs.httpCode'), 'type', t('docs.meaning'), t('docs.suggestion')]}
            rows={[
              ['401', <DocsInlineCode key="a">authentication_error</DocsInlineCode>, t('docs.err401'), t('docs.err401Suggestion')],
              ['403', <DocsInlineCode key="b">authorization_error</DocsInlineCode>, t('docs.err403'), t('docs.err403Suggestion')],
              ['400', <DocsInlineCode key="c">invalid_request_error</DocsInlineCode>, t('docs.err400'), t('docs.err400Suggestion')],
              ['402', <DocsInlineCode key="d">insufficient_balance</DocsInlineCode>, t('docs.err402'), t('docs.err402Suggestion')],
              ['429', <DocsInlineCode key="e">rate_limit_error</DocsInlineCode>, t('docs.err429'), t('docs.err429Suggestion')],
              ['502', <DocsInlineCode key="f">upstream_error</DocsInlineCode>, t('docs.err502'), t('docs.err502Suggestion')],
              ['500', <DocsInlineCode key="g">internal_error</DocsInlineCode>, t('docs.err500'), t('docs.err500Suggestion')],
            ]}
          />
          <DocsP>{t('docs.retrySuggestion')}</DocsP>
        </DocsArticle>
      )

    case 'insufficient-balance':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'symptom', title: t('docsSite.pages.insufficient-balance.hSymptom'), level: 2 },
            { id: 'fix', title: t('docsSite.pages.insufficient-balance.hFix'), level: 2 },
          ])}
        >
          <DocsH2 id="symptom">{t('docsSite.pages.insufficient-balance.hSymptom')}</DocsH2>
          <DocsP>{t('docs.err402')}</DocsP>
          <DocsP>
            HTTP <DocsInlineCode>402</DocsInlineCode> · <DocsInlineCode>insufficient_balance</DocsInlineCode>
          </DocsP>
          <DocsH2 id="fix">{t('docsSite.pages.insufficient-balance.hFix')}</DocsH2>
          <DocsP>{t('docs.err402Suggestion')}</DocsP>
          <DocsCallout>
            <LocaleLink href="/login" className="underline">
              {t('docsSite.pages.insufficient-balance.cta')}
            </LocaleLink>
          </DocsCallout>
        </DocsArticle>
      )

    case 'rate-limits':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'symptom', title: t('docsSite.pages.rate-limits.hSymptom'), level: 2 },
            { id: 'retry', title: t('docsSite.pages.rate-limits.hRetry'), level: 2 },
          ])}
        >
          <DocsH2 id="symptom">{t('docsSite.pages.rate-limits.hSymptom')}</DocsH2>
          <DocsP>{t('docs.err429')}</DocsP>
          <DocsH2 id="retry">{t('docsSite.pages.rate-limits.hRetry')}</DocsH2>
          <DocsP>{t('docs.retrySuggestion')}</DocsP>
        </DocsArticle>
      )

    case 'faq':
      return (
        <DocsArticle
          title={meta.title}
          description={meta.description}
          toc={toc([
            { id: 'q0', title: t('faq.q0'), level: 2 },
            { id: 'q2', title: t('faq.q2'), level: 2 },
            { id: 'q3', title: t('faq.q3'), level: 2 },
          ])}
        >
          <DocsH2 id="q0">{t('faq.q0')}</DocsH2>
          <DocsP>{t('faq.a0')}</DocsP>
          <DocsH2 id="q2">{t('faq.q2')}</DocsH2>
          <DocsP>{t('faq.a2')}</DocsP>
          <DocsH2 id="q3">{t('faq.q3')}</DocsH2>
          <DocsP>{t('faq.a3')}</DocsP>
        </DocsArticle>
      )

    default:
      return null
  }
}
