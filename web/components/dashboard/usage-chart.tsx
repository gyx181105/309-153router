"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { useState, useEffect } from "react"

interface DailyData {
  date:: number
  tokens: number
 string
  requests  cost: number
}

const defaultData: DailyData[] = Array.from({ length: 28 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (27 - i))
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    requests: Math.floor(Math.random() * 40000) + 20000,
    tokens: Math.floor(Math.random() * 2000000) + 500000,
    cost: Math.random() * 2 + 0.5,
  }
})

interface TooltipPayload {
  value: number
  dataKey: string
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-popover-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs text-muted-foreground">
          {p.dataKey === "requests"
            ? `请求: ${p.value.toLocaleString()}`
            : p.dataKey === "tokens"
            ? `Token: ${(p.value / 1000000).toFixed(2)}M`
            : `费用: $${p.value.toFixed(2)}`}
        </p>
      ))}
    </div>
  )
}

export function UsageChart() {
  const [metric, setMetric] = useState<"requests" | "tokens" | "cost">("requests")
  const [data, setData] = useState<DailyData[]>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/usage?days=30', {
          headers: { 'x-user-id': 'demo-user' },
        })
        const result = await response.json()

        if (result.daily_usage) {
          const chartData: DailyData[] = Object.entries(result.daily_usage)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, d]) => ({
              date: date.slice(5),
              requests: (d as { requests: number }).requests,
              tokens: (d as { tokens: number }).tokens,
              cost: (d as { cost: number }).cost,
            }))
          setData(chartData)
        }
      } catch (error) {
        console.error('Failed to fetch usage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatY = (v: number) => {
    if (metric === "requests") return v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
    if (metric === "tokens") return `${(v / 1000000).toFixed(1)}M`
    return `$${v.toFixed(1)}`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          API 使用量趋势
        </CardTitle>
        <Tabs value={metric} onValueChange={(v) => setMetric(v as typeof metric)}>
          <TabsList className="h-7 bg-secondary">
            <TabsTrigger value="requests" className="text-[11px] h-5 px-2.5">请求数</TabsTrigger>
            <TabsTrigger value="tokens" className="text-[11px] h-5 px-2.5">Token</TabsTrigger>
            <TabsTrigger value="cost" className="text-[11px] h-5 px-2.5">费用</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-[260px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.65 0.2 250)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.26 0.008 260)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.6 0.01 260)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.6 0.01 260)" }}
                  tickFormatter={formatY}
                />
                <RechartsTooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke="oklch(0.65 0.2 250)"
                  strokeWidth={2}
                  fill="url(#fillPrimary)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
