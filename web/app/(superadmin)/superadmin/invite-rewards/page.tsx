"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/app/(dashboard)/components/dashboard-layout"
import { AuthGuard } from "@/app/(auth)/components/auth-guard"
import { SuperadminNav } from "@/app/(superadmin)/components/superadmin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type RechargeReward = {
  id: number
  inviteCount: number
  rewardType: string
  rewardValue: number
  rewardName: string
  isActive: boolean
} | null

export default function SuperadminInviteRewardsPage() {
  const [rechargeReward, setRechargeReward] = useState<RechargeReward>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rewardValue, setRewardValue] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/superadmin/invite-rewards")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.rechargeReward) {
          const r = json.data.rechargeReward
          setRechargeReward(r)
          setRewardValue(String(r.rewardValue))
          setIsActive(r.isActive)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = () => {
    const value = Number(rewardValue)
    if (Number.isNaN(value) || value < 0) {
      setMessage({ type: "error", text: "请输入有效的金额（≥0）" })
      return
    }
    setSaving(true)
    setMessage(null)
    fetch("/api/superadmin/invite-rewards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewardValue: value, isActive }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setRechargeReward(json.data)
          setMessage({ type: "success", text: "已保存" })
        } else {
          setMessage({ type: "error", text: json.detail || "保存失败" })
        }
      })
      .catch((e) => setMessage({ type: "error", text: e.message || "保存失败" }))
      .finally(() => setSaving(false))
  }

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="p-6">
            <SuperadminNav />
            <p className="text-muted-foreground">加载中…</p>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <SuperadminNav />
          <div>
            <h1 className="text-lg font-semibold mb-1">邀请奖励设置</h1>
            <p className="text-xs text-muted-foreground">
              被邀请人首次充值时，邀请人获得的余额奖励（元）及启用状态
            </p>
          </div>

          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-base">被邀请人首充奖励</CardTitle>
              <CardDescription>
                {rechargeReward?.rewardName ?? "邀请好友注册且被邀请人首次充值后，邀请人获得的余额（元）"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rewardValue">奖励金额（元）</Label>
                <Input
                  id="rewardValue"
                  type="number"
                  min={0}
                  step={0.01}
                  value={rewardValue}
                  onChange={(e) => setRewardValue(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">启用</Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              {message && (
                <p
                  className={
                    message.type === "success"
                      ? "text-sm text-green-600"
                      : "text-sm text-destructive"
                  }
                >
                  {message.text}
                </p>
              )}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "保存中…" : "保存"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
