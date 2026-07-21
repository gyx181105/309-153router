"use client"

import { useState } from "react"
import { LocaleLink } from "@/components/locale-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n-context"
import { appendSourceToMessage, buildAuthHref } from "@/lib/traffic-source"
import { useTrafficSource } from "@/lib/use-traffic-source"
import { AiGatewaySectionTitle } from "./ai-gateway-section-title"

type Status = "idle" | "loading" | "ok" | "err"

export function AiGatewayConvert() {
  const { t, locale } = useI18n()
  const source = useTrafficSource()
  const registerHref = buildAuthHref(locale, "register", source)

  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errMsg, setErrMsg] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrMsg("")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          form_name: "ai_gateway_contact",
          source: source || undefined,
          message: appendSourceToMessage(undefined, source),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        setStatus("err")
        setErrMsg(data.error ?? t("contact.errorSubmit"))
        return
      }
      setStatus("ok")
      setPhone("")
    } catch {
      setStatus("err")
      setErrMsg(t("contact.errorNetwork"))
    }
  }

  return (
    <section
      id="contact"
      className="scroll-mt-4 border-t px-4 pb-28 pt-8"
      style={{
        borderColor: "var(--color-border-default)",
        background:
          "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-accent-soft) 35%, transparent) 100%)",
      }}
    >
      <div className="mx-auto max-w-lg">
        <AiGatewaySectionTitle title={t("aiGateway.convert.title")} subtitle={t("aiGateway.convert.subtitle")} />

        <div
          className="rounded-2xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--color-border-default)",
            backgroundColor: "var(--color-bg-surface)",
          }}
        >
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder={t("aiGateway.convert.phonePlaceholder")}
              required
              disabled={status === "loading"}
              className="h-12 text-base"
            />
            <Button type="submit" className="ds-btn-primary h-12 w-full text-[15px]" disabled={status === "loading"}>
              {status === "loading" ? t("contact.submitting") : t("aiGateway.convert.submit")}
            </Button>
            {status === "ok" && (
              <p className="text-center text-sm" style={{ color: "var(--color-success, #16a34a)" }}>
                {t("contact.success")}
              </p>
            )}
            {status === "err" && (
              <p className="text-center text-sm" style={{ color: "var(--color-danger, #ef4444)" }}>
                {errMsg}
              </p>
            )}
          </form>

          <p className="mt-4 text-center">
            <LocaleLink href={registerHref} className="text-sm font-medium underline-offset-4 hover:underline">
              {t("aiGateway.convert.registerLink")}
            </LocaleLink>
          </p>
        </div>
      </div>
    </section>
  )
}
