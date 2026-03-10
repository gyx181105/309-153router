"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Gift, CalendarDays, Calendar, KeyRound } from "lucide-react"

interface InviteStats {
  total_codes?: number
  total_invites?: number
  today_invites?: number
  last_7_days_invites?: number
  total_rewards?: number
}

interface InviteStatsCardsProps {
  stats: InviteStats | null
}

export function InviteStatsCards({ stats }: InviteStatsCardsProps) {
  if (!stats) {
    return null
  }

  const cards = [
    {
      title: "邀请用户总数",
      value: stats.total_invites || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "奖励总数",
      value: stats.total_rewards || 0,
      icon: Gift,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "今日邀请",
      value: stats.today_invites || 0,
      icon: CalendarDays,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "近7日邀请",
      value: stats.last_7_days_invites || 0,
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "邀请码总数",
      value: stats.total_codes || 0,
      icon: KeyRound,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`rounded-md p-1.5 ${card.bg}`}>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
