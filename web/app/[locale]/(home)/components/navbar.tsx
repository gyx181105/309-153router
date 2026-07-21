"use client"

import { useState } from "react"
import { LocaleLink } from "@/components/locale-link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useI18n()
  const navLinks = [
    { href: "#integration", label: t("nav.integration") },
    { href: "#features", label: t("nav.features") },
    { href: "/docs/quickstart", label: t("nav.docs") },
    { href: "/ai-gateway", label: t("nav.enterpriseNav") },
    { href: "#faq", label: t("nav.faq") },
    { href: "/blog", label: t("nav.news") },
  ]

  return (
    <header
      className="site-nav fixed top-0 left-0 right-0 z-50 border-b border-border/60 backdrop-blur-xl"
      style={{ background: "var(--navbar-bg)" }}
    >
      <nav className="flex h-16 w-full items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <LocaleLink
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            style={{
              color: "var(--color-text-primary)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "-0.03em",
            }}
          >
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "var(--color-button-primary-bg)",
                color: "var(--color-button-primary-text)",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700 }}>O</span>
            </div>
            <span>{t("common.siteName")}</span>
          </LocaleLink>

          <div className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 hover:text-(--color-text-primary)"
                style={{
                  color: "var(--color-text-body)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                }}
              >
                {link.label}
              </LocaleLink>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <LocaleLink
            href="/promo"
            className="text-[13px] font-semibold text-(--color-text-body) no-underline transition-colors hover:text-(--color-text-primary)"
          >
            {t("nav.promo")}
          </LocaleLink>
          <LocaleLink
            href="/login"
            className="text-[13px] font-semibold text-(--color-text-body) no-underline transition-colors hover:text-(--color-text-primary)"
          >
            {t("common.login")}
          </LocaleLink>
          <LocaleLink href="/register">
            <Button
              size="sm"
              className="h-8 rounded-lg bg-(--color-button-primary-bg) px-4 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-(--color-button-primary-hover) hover:shadow"
            >
              {t("common.register")}
            </Button>
          </LocaleLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: "var(--color-text-primary)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
            aria-label={t("common.menu")}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="border-t md:hidden"
          style={{
            borderColor: "var(--color-border-default)",
            backgroundColor: "var(--color-bg-surface)",
          }}
        >
          <div className="flex flex-col gap-4 p-6">
            {navLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className="transition-colors hover:opacity-80"
                style={{
                  color: "var(--color-text-body)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "color var(--motion-base) var(--ease-standard)",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </LocaleLink>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <LanguageSwitcher />
              <LocaleLink
                href="/promo"
                className="w-full text-center text-[13px] font-semibold text-(--color-text-body) no-underline hover:text-(--color-text-primary)"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.promo")}
              </LocaleLink>
              <LocaleLink
                href="/login"
                className="w-full text-center text-[13px] font-semibold text-(--color-text-body) no-underline hover:text-(--color-text-primary)"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("common.login")}
              </LocaleLink>
              <LocaleLink href="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="h-9 w-full rounded-lg bg-(--color-button-primary-bg) text-[13px] font-semibold text-white hover:bg-(--color-button-primary-hover)">
                  {t("common.register")}
                </Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
