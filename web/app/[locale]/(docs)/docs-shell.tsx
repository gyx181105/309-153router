'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { DocsHeader } from './components/docs-header'
import { DocsSidebar } from './components/docs-sidebar'
import { DEFAULT_DOCS_SLUG, isDocsSlug, type DocsSlug } from '@/lib/docs/nav'
import { usePathname } from 'next/navigation'

function slugFromPathname(pathname: string | null): DocsSlug {
  if (!pathname) return DEFAULT_DOCS_SLUG
  const parts = pathname.split('/').filter(Boolean)
  // /zh/docs/quickstart → ['zh','docs','quickstart']
  const docsIdx = parts.indexOf('docs')
  const slug = docsIdx >= 0 ? parts[docsIdx + 1] : undefined
  if (slug && isDocsSlug(slug)) return slug
  return DEFAULT_DOCS_SLUG
}

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const activeSlug = slugFromPathname(pathname)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--color-bg-page, var(--color-bg-surface))' }}
    >
      <DocsHeader mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1">
        <DocsSidebar
          activeSlug={activeSlug}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
