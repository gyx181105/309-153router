"use client"

import { KeyRound, Activity, Wallet, LineChart } from "lucide-react"
import { LocaleLink } from "@/components/locale-link"
import { useI18n } from "@/lib/i18n-context"

const CONSOLE_ITEMS = [
  { icon: Wallet, labelKey: "consolePreview.consoleBalance" },
  { icon: KeyRound, labelKey: "consolePreview.consoleKeys" },
  { icon: LineChart, labelKey: "consolePreview.consoleUsage" },
  { icon: Activity, labelKey: "consolePreview.consoleHealth" },
] as const

export function ConsoleSection() {
  const { t } = useI18n()

  return (
    <section
      id="console"
      className="border-t py-24"
      style={{
        borderColor: "var(--color-border-default)",
        paddingTop: "var(--layout-section-spacing)",
        paddingBottom: "var(--layout-section-spacing)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 36px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-4)",
                lineHeight: 1.35,
              }}
            >
              {t("consolePreview.title")}
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.65, color: "var(--color-text-body)" }}>
              {t("consolePreview.subtitle")}
            </p>
            <ul className="mt-6 space-y-3">
              {CONSOLE_ITEMS.map((item) => (
                <li
                  key={item.labelKey}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--color-text-body)" }}
                >
                  <item.icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--color-accent-primary)" }}
                    aria-hidden
                  />
                  {t(item.labelKey)}
                </li>
              ))}
            </ul>
            <LocaleLink
              href="/login"
              className="mt-6 inline-block text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("consolePreview.loginHint")}
            </LocaleLink>
          </div>

          <LocaleLink
            href="/login"
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ borderRadius: "1rem" }}
            aria-label={t("consolePreview.loginHint")}
          >
            <figure
              className="overflow-hidden rounded-2xl border shadow-sm transition-shadow group-hover:shadow-md"
              style={{
                borderColor: "var(--color-border-default)",
                backgroundColor: "var(--color-bg-surface)",
              }}
            >
              <div
                className="flex items-center justify-between gap-2 border-b px-4 py-3"
                style={{
                  borderColor: "var(--color-border-default)",
                  backgroundColor: "var(--color-bg-muted)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-border-default)" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-border-default)" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-border-default)" }} />
                  <span className="ml-2 text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                    {t("consolePreview.consoleWindowTitle")}
                  </span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: "var(--color-text-muted)" }}>
                  {t("consolePreview.consoleNote")}
                </span>
              </div>

              <div className="relative bg-[#e8eef5] p-2">
                <picture>
                  <source
                    media="(min-width: 640px)"
                    srcSet="/images/console-overview.svg?v=5"
                    width={1120}
                    height={640}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/console-overview-mobile.svg?v=5"
                    alt={t("consolePreview.consoleAria")}
                    width={720}
                    height={520}
                    className="h-auto w-full rounded-lg aspect-[720/520] sm:aspect-[1120/640]"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </figure>
          </LocaleLink>
        </div>
      </div>
    </section>
  )
}
