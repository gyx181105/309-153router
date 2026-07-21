'use client'

import Link from 'next/link'

import { ThemeToggle } from '@/app/[locale]/(home)/components/theme-toggle'
import { LocaleLink } from '@/components/locale-link'
import { useI18n } from '@/lib/i18n-context'

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()
  const links = [
    { href: '#integration', label: t('nav.integration') },
    { href: '/docs/quickstart', label: t('nav.docs') },
    { href: '/ai-gateway', label: t('nav.enterpriseNav') },
    { href: '/login', label: t('common.login') },
    { href: '/register', label: t('common.register') },
  ] as const

  return (
    <footer
      className="border-t py-6"
      style={{
        borderColor: 'var(--color-border-default)',
        backgroundColor: 'var(--color-bg-surface)',
      }}
    >
      <div
        className="mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:items-start sm:gap-6"
        style={{ maxWidth: 'var(--layout-max-width)' }}
      >
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <p className="text-xs text-[var(--color-text-muted)]">
            {t('footer.copyright', { year: String(year) })}
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start"
            aria-label="Footer"
          >
            {links.map((link, i) => (
              <span key={link.href} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="hidden text-[var(--color-border-default)] sm:inline" aria-hidden>
                    ·
                  </span>
                )}
                <LocaleLink
                  href={link.href}
                  className="text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
                >
                  {link.label}
                </LocaleLink>
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--color-text-body)]">
          <Link
            href="/agents"
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
          >
            Agent
          </Link>
          <span className="text-[var(--color-border-default)]" aria-hidden>
            |
          </span>
          <span className="flex items-center" title={t('footer.themeToggle')}>
            <ThemeToggle />
          </span>
        </div>
      </div>
    </footer>
  )
}
