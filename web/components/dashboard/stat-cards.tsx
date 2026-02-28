"use client"

import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, Zap, DollarSign, Clock, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Stats {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  description: string
}

export function StatCards() {
  const [stats, setStats] = useState<Stats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/usage?days=30', {
          headers: { 'x-user-id': 'demo-user' },
        })
        const data = await response.json()

        if (data.summary) {
          setStats([
            {
              label: 'API 请求总量',
              value: data.summary.total_requests.toLocaleString(),
              change: '+12.5%',
              trend: 'up',
              icon: Zap,
              description: '过去 30 天',
            },
            {
              label: '消费金额',
              value: `$${data.summary.total_cost.toFixed(2)}`,
              change: '+8.2%',
              trend: 'up',
              icon: DollarSign,
              description: '本月累计',
            },
            {
              label: '平均延迟',
              value: '234ms',
              change: '-15.3%',
              trend: 'down',
              icon: Clock,
              description: '过去 7 天平均',
            },
            {
              label: '成功率',
              value: '99.87%',
              change: '+0.12%',
              trend: 'up',
              icon: Activity,
              description: '过去 24 小时',
            },
          ])
        } else {
          setStats(getDefaultStats())
        }
      } catch {
        setStats(getDefaultStats())
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="mt-3 h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="mt-2 h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <stat.icon className="size-4 text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-card-foreground">
                {stat.value}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center text-xs font-medium ${
                  stat.label === '平均延迟'
                    ? 'text-success'
                    : stat.trend === 'up'
                    ? 'text-success'
                    : 'text-chart-5'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="mr-0.5 size-3" />
                ) : (
                  <ArrowDownRight className="mr-0.5 size-3" />
                )}
                {stat.change}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getDefaultStats(): Stats[] {
  return [
    {
      label: 'API 请求总量',
      value: '1,284,392',
      change: '+12.5%',
      trend: 'up',
      icon: Zap,
      description: '过去 30 天',
    },
    {
      label: '消费金额',
      value: '$42.80',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      description: '本月累计',
    },
    {
      label: '平均延迟',
      value: '234ms',
      change: '-15.3%',
      trend: 'down',
      icon: Clock,
      description: '过去 7 天平均',
    },
    {
      label: '成功率',
      value: '99.87%',
      change: '+0.12%',
      trend: 'up',
      icon: Activity,
      description: '过去 24 小时',
    },
  ]
}
