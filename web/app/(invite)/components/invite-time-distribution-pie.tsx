"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"

interface InviteItem {
  used_at: string | null
}

const COLORS = ["#1a5276", "#2e86c1", "#5dade2"]

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-popover-foreground">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">{payload[0].value}%</p>
    </div>
  )
}

interface InviteTimeDistributionPieProps {
  invites: InviteItem[]
  loading?: boolean
}

export function InviteTimeDistributionPie({ invites, loading }: InviteTimeDistributionPieProps) {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const buckets = {
    "近7天": 0,
    "8-30天": 0,
    "30天以上": 0,
  }

  invites.forEach((inv) => {
    if (!inv.used_at) return
    const t = new Date(inv.used_at).getTime()
    const daysAgo = (now - t) / dayMs
    if (daysAgo <= 7) buckets["近7天"] += 1
    else if (daysAgo <= 30) buckets["8-30天"] += 1
    else buckets["30天以上"] += 1
  })

  const total = invites.filter((i) => i.used_at).length
  const items = (
    [
      { name: "近7天", count: buckets["近7天"], color: COLORS[0] },
      { name: "8-30天", count: buckets["8-30天"], color: COLORS[1] },
      { name: "30天以上", count: buckets["30天以上"], color: COLORS[2] },
    ] as const
  )
    .map((x) => ({
      ...x,
      percentage: total > 0 ? Math.round((x.count / total) * 100) : 0,
    }))
    .filter((x) => x.count > 0)

  const pieData = items.map((m) => ({ name: m.name, value: m.percentage }))
  const colors = items.map((m) => m.color)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-card-foreground">
          邀请用户注册时间分布
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            暂无数据
          </div>
        ) : (
          <>
            <div className="mx-auto h-[160px] w-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="text-xs font-medium text-card-foreground">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-medium text-card-foreground tabular-nums shrink-0 ml-2">
                      {item.percentage}% · {item.count}人
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
