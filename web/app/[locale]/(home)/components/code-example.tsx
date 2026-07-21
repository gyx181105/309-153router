"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

const codeExamples = {
  python: `import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.optrouter.com/v1",
    api_key=os.environ.get("OPTROUTER_API_KEY"),
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Hello"}
    ],
)

print(response.choices[0].message.content)`,

  javascript: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.optrouter.com/v1',
  apiKey: process.env.OPTROUTER_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'Hello' }
  ],
});

console.log(response.choices[0].message.content);`,

  curl: `curl https://api.optrouter.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPTROUTER_API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'`,
}

const TAB_IDS = ["python", "javascript", "curl"] as const
const TAB_KEYS = ["codeExample.tabPy", "codeExample.tabJs", "codeExample.tabCurl"]
const BASE_URL = "https://api.optrouter.com/v1"

export function CodeExample() {
  const { t } = useI18n()
  const tabs = TAB_IDS.map((id, i) => ({ id, label: t(TAB_KEYS[i]) }))
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>("python")
  const [copied, setCopied] = useState(false)
  const [baseUrlCopied, setBaseUrlCopied] = useState(false)
  const steps = [
    { title: t("codeExample.step0Title"), desc: t("codeExample.step0Desc") },
    { title: t("codeExample.step1Title"), desc: t("codeExample.step1Desc") },
    { title: t("codeExample.step2Title"), desc: t("codeExample.step2Desc") },
  ]

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyBaseUrl = () => {
    navigator.clipboard.writeText(BASE_URL)
    setBaseUrlCopied(true)
    setTimeout(() => setBaseUrlCopied(false), 2000)
  }

  return (
    <section
      id="integration"
      className="border-t py-24"
      style={{
        borderColor: "var(--color-border-default)",
        paddingTop: "var(--layout-section-spacing)",
        paddingBottom: "var(--layout-section-spacing)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6" style={{ maxWidth: "var(--layout-max-width)" }}>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            {t("codeExample.title")}
          </h2>
          <p
            style={{
              marginTop: "var(--space-4)",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "var(--color-text-body)",
            }}
          >
            {t("codeExample.subtitle")}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <ol className="space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--color-bg-muted)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--color-text-body)" }}>
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div
            className="overflow-hidden rounded-xl border"
            style={{
              borderColor: "var(--color-border-default)",
              backgroundColor: "var(--color-bg-surface)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4"
              style={{
                borderColor: "var(--color-border-default)",
                backgroundColor: "var(--color-bg-muted)",
              }}
            >
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="border-b-2 px-4 py-3 text-sm transition-colors"
                    style={{
                      borderBottomColor: activeTab === tab.id ? "var(--color-text-primary)" : "transparent",
                      color: activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-body)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-surface"
                style={{ color: "var(--color-text-body)" }}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t("common.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t("codeExample.copy")}
                  </>
                )}
              </button>
            </div>

            <div
              className="flex items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-6"
              style={{
                borderColor: "var(--color-border-default)",
                backgroundColor: "var(--color-bg-surface)",
              }}
            >
              <div className="min-w-0 flex-1">
                <p
                  className="text-[11px] font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("codeExample.baseUrlLabel")}
                </p>
                <p
                  className="mt-0.5 truncate font-mono text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                  title={BASE_URL}
                >
                  {BASE_URL}
                </p>
              </div>
              <button
                type="button"
                onClick={copyBaseUrl}
                className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-muted"
                style={{ color: "var(--color-text-body)" }}
                aria-label={t("codeExample.copyBaseUrl")}
              >
                {baseUrlCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    {t("common.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    {t("codeExample.copy")}
                  </>
                )}
              </button>
            </div>

            <p
              className="border-b px-6 py-3 text-sm"
              style={{
                borderColor: "var(--color-border-default)",
                color: "var(--color-text-muted)",
              }}
            >
              {t("codeExample.sampleHint")}
            </p>
            <pre className="overflow-x-auto p-6" style={{ backgroundColor: "var(--color-bg-surface)" }}>
              <code
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--color-text-body)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {codeExamples[activeTab]}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
