"use client"

import { LocaleLink } from "@/components/locale-link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, GitBranch, Plug } from "lucide-react"
import { useId, useMemo } from "react"
import { useI18n } from "@/lib/i18n-context"

const TRUST_TECHS = ["OpenAI", "Claude", "Gemini", "DeepSeek"]
const PILL_ICONS = [Plug, GitBranch] as const

function HeroRoutingArt({ className }: { className?: string }) {
  const raw = useId()
  const uid = raw.replace(/:/g, "")
  const lineId = `hero-routing-line-${uid}`
  const surfaceId = `hero-routing-surface-${uid}`

  const nodes = useMemo(
    () => [
      { label: "OpenAI", x: 260, y: 70 },
      { label: "Claude", x: 252, y: 190 },
      { label: "Gemini", x: 70, y: 72 },
      { label: "DeepSeek", x: 58, y: 190 },
    ],
    []
  )
  const hub = { x: 160, y: 130 }

  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={lineId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.65" />
        </linearGradient>
        <radialGradient id={surfaceId} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-bg-surface)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="280" fill={`url(#${surfaceId})`} rx="24" />
      <circle
        cx={160}
        cy={130}
        r="112"
        fill="none"
        stroke="var(--color-border-default)"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <g transform="translate(160 130)">
        <circle
          r="72"
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeOpacity="0.16"
          strokeWidth="1.2"
          strokeDasharray="4 7"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0"
            to="360"
            dur="22s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
      {nodes.map((n, i) => (
        <line
          key={i}
          x1={hub.x}
          y1={hub.y}
          x2={n.x}
          y2={n.y}
          stroke={`url(#${lineId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        >
          <animate
            attributeName="opacity"
            values="0.22;0.72;0.22"
            dur="3.4s"
            begin={`${i * 0.35}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {nodes.map((n, i) => (
        <circle key={`flow-${i}`} r="2.6" fill="var(--color-accent-primary)" opacity="0.85">
          <animateMotion
            dur={`${2.2 + i * 0.25}s`}
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
            path={`M ${hub.x} ${hub.y} L ${n.x} ${n.y}`}
          />
          <animate
            attributeName="opacity"
            values="0;0.92;0"
            dur={`${2.2 + i * 0.25}s`}
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {nodes.map((n, i) => (
        <g key={`o-${i}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r="7"
            fill="var(--color-bg-surface)"
            stroke={`url(#${lineId})`}
            strokeWidth="1.6"
          />
          <text
            x={n.x}
            y={n.y < hub.y ? n.y - 14 : n.y + 20}
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-secondary)"
            fontWeight="600"
          >
            {n.label}
          </text>
        </g>
      ))}
      <circle
        cx={hub.x}
        cy={hub.y}
        r="28"
        fill="color-mix(in srgb, var(--color-accent-soft) 72%, var(--color-bg-surface))"
        stroke={`url(#${lineId})`}
        strokeWidth="2.4"
      />
      <circle cx={hub.x} cy={hub.y} r="8" fill="var(--color-accent-primary)" opacity="0.88" />
      <rect
        x="98"
        y="232"
        width="124"
        height="24"
        rx="12"
        fill="color-mix(in srgb, var(--color-bg-surface) 92%, var(--color-accent-soft))"
        stroke="color-mix(in srgb, var(--color-accent-primary) 28%, transparent)"
      />
      <text x={hub.x} y="248" textAnchor="middle" fontSize="10.5" fill="var(--color-text-muted)" fontWeight="500">
        Smart Routing · Auto Failover
      </text>
    </svg>
  )
}

export function Hero() {
  const { t } = useI18n()
  const pillLabels = [t("hero.pill1"), t("hero.pill2")]
  const pills = PILL_ICONS.map((Icon, i) => ({ Icon, label: pillLabels[i]! }))

  return (
    <section
      className="hero relative overflow-hidden pt-20 lg:min-h-screen"
      aria-label={t("hero.ariaLabel")}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.45] dark:opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--color-border-default) 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />
      <div className="hero-glow absolute inset-0 -z-10 pointer-events-none" aria-hidden />

      <div className="hero-inner relative mx-auto flex max-w-6xl flex-col justify-center px-6 pb-14 pt-6 lg:min-h-[calc(100vh-4rem)] lg:px-8 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 text-center lg:max-w-xl lg:text-left xl:max-w-2xl">
            <p
              className="mb-5 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide lg:justify-start"
              style={{
                color: "var(--color-accent-primary)",
                backgroundColor: "color-mix(in srgb, var(--color-accent-soft) 80%, transparent)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "color-mix(in srgb, var(--color-accent-primary) 22%, transparent)",
              }}
            >
              {t("hero.badge")}
            </p>

            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-5)",
              }}
            >
              <span className="block">{t("hero.headline1")}</span>
              <span
                className="mt-3 block"
                style={{
                  fontSize: "clamp(17px, 2vw, 22px)",
                  fontWeight: 500,
                  color: "color-mix(in srgb, var(--color-accent-primary) 62%, var(--color-text-secondary))",
                }}
              >
                {t("hero.headline2")}
              </span>
            </h1>

            <p
              className="mb-7 max-w-xl text-pretty text-base leading-relaxed sm:text-[17px] lg:mx-0"
              style={{ color: "var(--color-text-body)" }}
            >
              {t("hero.subtitle")}
            </p>

            <div className="mx-auto mb-7 flex w-full max-w-md flex-col gap-3 sm:max-w-lg sm:flex-row sm:justify-center lg:mx-0 lg:justify-start">
              <LocaleLink href="/register" className="sm:min-w-44 sm:flex-1 lg:max-w-52">
                <Button className="ds-btn-primary h-11 w-full px-6 text-sm sm:h-10">
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                </Button>
              </LocaleLink>
              <a href="#integration" className="sm:min-w-44 sm:flex-1 lg:max-w-52">
                <Button variant="outline" className="h-11 w-full text-sm sm:h-10">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5 opacity-70" aria-hidden />
                  {t("hero.linkDocs")}
                </Button>
              </a>
            </div>

            <div className="mb-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {pills.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide ring-1 ring-black/5 dark:ring-white/8"
                  style={{
                    backgroundColor: "var(--color-bg-muted)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Icon
                    className="h-3.5 w-3.5 shrink-0 opacity-80"
                    style={{ color: "var(--color-accent-primary)" }}
                    aria-hidden
                  />
                  {label}
                </span>
              ))}
            </div>

            <div
              className="hero-trust rounded-xl px-4 py-3"
              style={{
                border: "1px solid var(--color-border-default)",
                backgroundColor: "color-mix(in srgb, var(--color-bg-surface) 90%, transparent)",
              }}
            >
              <p className="text-xs font-medium tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                {t("hero.trustLabel")}
              </p>
              <p
                className="mt-1.5 max-w-xl text-xs leading-relaxed sm:text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {TRUST_TECHS.join(" · ")}
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 lg:flex lg:w-[min(42%,23rem)] lg:justify-end xl:w-96">
            <div
              className="w-full rounded-2xl p-4 shadow-xl ring-1 ring-black/5 dark:ring-white/8"
              style={{
                background:
                  "linear-gradient(155deg, color-mix(in srgb, var(--color-bg-surface) 90%, var(--color-accent-soft)), var(--color-bg-muted))",
              }}
            >
              <HeroRoutingArt className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
