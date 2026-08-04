"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { StatCards } from "./stat-cards"
import { UsageChart } from "./usage-chart"
import { ModelUsage } from "./model-usage"
import { ProviderUsage } from "./provider-usage"
import { ActivityLog } from "./activity-log"
import { QuickStart } from "./quick-start"
import { PopularModels } from "./popular-models"
import { DashboardOnboarding } from "./dashboard-onboarding"
import { useI18n } from "@/lib/i18n-context"

const ALIPAY_PENDING_ORDER_KEY = "pendingAlipayRechargeOrderId"

export function DashboardShell() {
  const { t } = useI18n()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("alipay") !== "success") return

    let cancelled = false

    async function syncAlipayOrder() {
      let orderId = ""
      try {
        orderId = sessionStorage.getItem(ALIPAY_PENDING_ORDER_KEY) || ""
      } catch {
        /* ignore */
      }
      const gatewayOrderNo = searchParams.get("out_trade_no") || ""

      try {
        if (orderId || gatewayOrderNo) {
          const res = await fetch("/api/recharge/sync-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              orderId ? { orderId } : { gatewayOrderNo }
            ),
          })
          const json = await res.json().catch(() => null)
          if (!cancelled && json?.ok && json?.data?.paid) {
            toast.success(t("recharge.toastRechargeSuccess"))
          } else if (!cancelled) {
            // 回跳成功但入账仍可能异步延迟
            toast.success(t("recharge.toastRechargeSuccess"))
          }
        } else if (!cancelled) {
          toast.success(t("recharge.toastRechargeSuccess"))
        }
      } catch {
        if (!cancelled) toast.success(t("recharge.toastRechargeSuccess"))
      } finally {
        try {
          sessionStorage.removeItem(ALIPAY_PENDING_ORDER_KEY)
        } catch {
          /* ignore */
        }
      }

      if (cancelled) return
      const url = new URL(window.location.href)
      url.searchParams.delete("alipay")
      ;[
        "charset",
        "out_trade_no",
        "method",
        "total_amount",
        "trade_no",
        "auth_app_id",
        "version",
        "app_id",
        "sign",
        "sign_type",
        "seller_id",
        "timestamp",
      ].forEach((k) => url.searchParams.delete(k))
      window.history.replaceState({}, "", url.pathname + url.search)
    }

    syncAlipayOrder()
    return () => {
      cancelled = true
    }
  }, [searchParams, t])

  return (
    <div className="p-6">
      <div className="space-y-6">
        <DashboardOnboarding />
        <StatCards />
        <UsageChart />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ModelUsage />
          <ProviderUsage />
        </div>
        <ActivityLog />
        <PopularModels />
        <QuickStart />
      </div>
    </div>
  )
}
