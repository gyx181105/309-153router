"use client"

import { ThemeToggle } from "@/app/(home)/components/theme-toggle"

export function Footer() {
  return (
    <footer
      className="border-t py-6"
      style={{
        borderColor: "var(--color-border-default)",
        backgroundColor: "var(--color-bg-surface)",
      }}
    >
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:gap-0" style={{ maxWidth: "var(--layout-max-width)" }}>
        <p className="text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} OptRouter. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-[var(--color-text-body)]">
          <span className="text-[var(--color-border-default)]" aria-hidden>|</span>
          <span className="flex items-center" title="切换深色/浅色模式">
            <ThemeToggle />
          </span>
        </div>
      </div>
    </footer>
  )
}
