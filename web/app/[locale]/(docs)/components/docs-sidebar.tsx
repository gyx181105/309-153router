'use client'

import { LocaleLink } from '@/components/locale-link'
import { useI18n } from '@/lib/i18n-context'
import { DOCS_NAV, type DocsSlug } from '@/lib/docs/nav'

type Props = {
  activeSlug: DocsSlug
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

export function DocsSidebar({ activeSlug, mobileOpen, onMobileOpenChange }: Props) {
  const { t } = useI18n()

  const nav = (
    <nav className="space-y-6 px-3 py-4" aria-label={t('docsSite.sidebarLabel')}>
      {DOCS_NAV.map((group) => (
        <div key={group.id}>
          <p
            className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t(group.labelKey)}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.slug === activeSlug
              return (
                <li key={item.slug}>
                  <LocaleLink
                    href={`/docs/${item.slug}`}
                    onClick={() => onMobileOpenChange(false)}
                    className="block rounded-md px-2 py-1.5 text-[13px] no-underline transition-colors"
                    style={{
                      backgroundColor: active ? 'var(--color-bg-muted)' : 'transparent',
                      color: active ? 'var(--color-text-primary)' : 'var(--color-text-body)',
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {t(item.labelKey)}
                  </LocaleLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => onMobileOpenChange(false)}
          aria-hidden
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto border-r pt-14 transition-transform lg:static lg:z-0 lg:w-[240px] lg:shrink-0 lg:translate-x-0 lg:pt-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          borderColor: 'var(--color-border-default)',
          backgroundColor: 'var(--color-bg-surface)',
        }}
      >
        {nav}
      </aside>
    </>
  )
}
