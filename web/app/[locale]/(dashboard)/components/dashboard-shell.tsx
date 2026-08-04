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

export function DashboardShell() {
  const { t } = useI18n()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("alipay") !== "success") return
    toast.success(t("recharge.toastRechargeSuccess"))
    const url = new URL(window.location.href)
    url.searchParams.delete("alipay")
    // 支付宝回跳可能带 charset/out_trade_no 等参数，一并清掉
    ;["charset", "out_trade_no", "method", "total_amount", "trade_no", "auth_app_id", "version", "app_id", "sign", "sign_type", "seller_id", "timestamp"].forEach(
      (k) => url.searchParams.delete(k)
    )
    window.history.replaceState({}, "", url.pathname + url.search)
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
