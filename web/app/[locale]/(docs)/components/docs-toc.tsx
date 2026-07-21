'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n-context'

export type TocItem = { id: string; title: string; level: 2 | 3 }

type Props = {
  items: TocItem[]
}

export function DocsToc({ items }: Props) {
  const { t } = useI18n()
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return
    const observers: IntersectionObserver[] = []
    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActiveId(item.id)
        },
        { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label={t('docsSite.onThisPage')} className="sticky top-24">
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-wide"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {t('docsSite.onThisPage')}
      </p>
      <ul className="space-y-2 border-l" style={{ borderColor: 'var(--color-border-default)' }}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block border-l-2 py-0.5 text-[13px] transition-colors"
              style={{
                marginLeft: '-1px',
                paddingLeft: item.level === 3 ? '1.25rem' : '0.75rem',
                borderLeftColor: activeId === item.id ? 'var(--color-text-primary)' : 'transparent',
                color: activeId === item.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                fontWeight: activeId === item.id ? 600 : 400,
              }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
