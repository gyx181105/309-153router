'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LocaleLink } from '@/components/locale-link'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n-context'
import { isAuthenticated } from '@/lib/auth-client'

type Props = {
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

export function DocsHeader({ mobileOpen, onMobileOpenChange }: Props) {
  const { t } = useI18n()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isAuthenticated())
  }, [])

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        borderColor: 'var(--color-border-default)',
        background: 'var(--navbar-bg)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md lg:hidden"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label={mobileOpen ? t('docsSite.closeMenu') : t('docsSite.openMenu')}
            aria-expanded={mobileOpen}
            onClick={() => onMobileOpenChange(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <LocaleLink
            href="/"
            className="flex shrink-0 items-center gap-2 no-underline"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold"
              style={{
                background: 'var(--color-button-primary-bg)',
                color: 'var(--color-button-primary-text)',
              }}
            >
              O
            </div>
            <span className="text-[15px] font-semibold tracking-tight">{t('common.siteName')}</span>
          </LocaleLink>

          <nav className="hidden items-center gap-4 md:flex">
            <LocaleLink
              href="/docs/quickstart"
              className="text-[13px] font-semibold no-underline transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-body)' }}
            >
              {t('docsSite.header.docs')}
            </LocaleLink>
            <LocaleLink
              href="/docs/chat-completions"
              className="text-[13px] font-semibold no-underline transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-body)' }}
            >
              {t('docsSite.header.apiReference')}
            </LocaleLink>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {loggedIn ? (
            <LocaleLink
              href="/dashboard"
              className="text-[13px] font-semibold no-underline transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-body)' }}
            >
              {t('docsSite.header.console')}
            </LocaleLink>
          ) : (
            <>
              <LocaleLink
                href="/login"
                className="text-[13px] font-semibold no-underline transition-colors hover:opacity-80"
                style={{ color: 'var(--color-text-body)' }}
              >
                {t('common.login')}
              </LocaleLink>
              <LocaleLink href="/register">
                <Button
                  size="sm"
                  className="h-8 rounded-lg px-3 text-[13px] font-semibold text-white"
                  style={{ background: 'var(--color-button-primary-bg)' }}
                >
                  {t('common.register')}
                </Button>
              </LocaleLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
