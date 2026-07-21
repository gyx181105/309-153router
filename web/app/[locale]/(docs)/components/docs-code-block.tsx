'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useI18n } from '@/lib/i18n-context'

type Props = {
  code: string
  language?: string
}

export function DocsCodeBlock({ code, language }: Props) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="group relative my-4 overflow-hidden rounded-lg border"
      style={{
        borderColor: 'var(--color-border-default)',
        backgroundColor: 'var(--color-bg-muted)',
      }}
    >
      {language ? (
        <div
          className="flex items-center justify-between border-b px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>{language}</span>
        </div>
      ) : null}
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-2 top-2 z-10 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:opacity-90"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          color: 'var(--color-text-body)',
          border: '1px solid var(--color-border-default)',
          top: language ? '2.25rem' : '0.5rem',
        }}
        aria-label={t('docsSite.copy')}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            {t('common.copied')}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            {t('docsSite.copy')}
          </>
        )}
      </button>
      <pre className="overflow-x-auto p-4 pr-24 text-[13px] leading-relaxed">
        <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-body)' }}>{code}</code>
      </pre>
    </div>
  )
}
