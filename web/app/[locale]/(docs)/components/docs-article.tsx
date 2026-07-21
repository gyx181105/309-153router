'use client'

import type { ReactNode } from 'react'
import { DocsToc, type TocItem } from './docs-toc'

type Props = {
  title: string
  description?: string
  toc: TocItem[]
  children: ReactNode
}

export function DocsArticle({ title, description, toc, children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <article className="min-w-0 flex-1 pb-16">
        <header className="mb-8 max-w-3xl">
          <h1
            className="text-[28px] font-semibold tracking-tight sm:text-[32px]"
            style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
              {description}
            </p>
          ) : null}
        </header>
        <div className="docs-prose max-w-3xl">{children}</div>
      </article>

      <aside className="hidden w-[200px] shrink-0 xl:block">
        <DocsToc items={toc} />
      </aside>
    </div>
  )
}

export function DocsH2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-3 mt-10 scroll-mt-24 text-xl font-semibold tracking-tight"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {children}
    </h2>
  )
}

export function DocsH3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mb-2 mt-6 scroll-mt-24 text-base font-semibold"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {children}
    </h3>
  )
}

export function DocsP({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
      {children}
    </p>
  )
}

export function DocsUl({ children }: { children: ReactNode }) {
  return (
    <ul
      className="mb-4 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed"
      style={{ color: 'var(--color-text-body)' }}
    >
      {children}
    </ul>
  )
}

export function DocsTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--color-border-default)' }}>
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b px-3 py-2 text-left text-xs font-semibold"
                style={{
                  borderColor: 'var(--color-border-default)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b px-3 py-2 align-top text-[13px]"
                  style={{
                    borderColor: 'var(--color-border-default)',
                    color: 'var(--color-text-body)',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DocsCallout({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-4 rounded-lg border px-4 py-3 text-[14px] leading-relaxed"
      style={{
        borderColor: 'var(--color-border-default)',
        backgroundColor: 'var(--color-bg-muted)',
        color: 'var(--color-text-body)',
      }}
    >
      {children}
    </div>
  )
}

export function DocsInlineCode({ children }: { children: ReactNode }) {
  return (
    <code
      className="rounded px-1 py-0.5 font-mono text-[13px]"
      style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-primary)' }}
    >
      {children}
    </code>
  )
}
