"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    model: "GPT-4o",
    type: "chat.completions",
    status: "success" as const,
    tokens: 2840,
    latency: "186ms",
    time: "刚刚",
  },
  {
    id: 2,
    model: "Claude 3.5 Sonnet",
    type: "chat.completions",
    status: "success" as const,
    tokens: 4120,
    latency: "312ms",
    time: "2 分钟前",
  },
  {
    id: 3,
    model: "Gemini 2.0 Flash",
    type: "chat.completions",
    status: "success" as const,
    tokens: 1560,
    latency: "94ms",
    time: "5 分钟前",
  },
  {
    id: 4,
    model: "GPT-4o",
    type: "chat.completions",
    status: "error" as const,
    tokens: 0,
    latency: "2400ms",
    time: "8 分钟前",
  },
  {
    id: 5,
    model: "DeepSeek V3",
    type: "chat.completions",
    status: "success" as const,
    tokens: 3280,
    latency: "245ms",
    time: "12 分钟前",
  },
  {
    id: 6,
    model: "Llama 3.3 70B",
    type: "chat.completions",
    status: "success" as const,
    tokens: 1820,
    latency: "178ms",
    time: "15 分钟前",
  },
  {
    id: 7,
    model: "Claude 3.5 Sonnet",
    type: "embeddings",
    status: "success" as const,
    tokens: 512,
    latency: "42ms",
    time: "18 分钟前",
  },
  {
    id: 8,
    model: "GPT-4o",
    type: "chat.completions",
    status: "rate_limited" as const,
    tokens: 0,
    latency: "\u2014",
    time: "22 分钟前",
  },
]

export function ActivityLog() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-card-foreground">
            最近请求
          </CardTitle>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
            查看全部
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[340px] overflow-y-auto px-6">
          {activities.map((activity, idx) => (
            <div
              key={activity.id}
              className={`flex items-center gap-4 py-3 ${
                idx !== activities.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Status dot */}
              <div
                className={`size-2 shrink-0 rounded-full ${
                  activity.status === "success"
                    ? "bg-success"
                    : activity.status === "error"
                    ? "bg-destructive"
                    : "bg-warning"
                }`}
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-card-foreground">
                    {activity.model}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 border-border text-muted-foreground font-mono"
                  >
                    {activity.type}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {activity.time}
                </p>
              </div>
              {/* Metrics */}
              <div className="flex items-center gap-4 text-right shrink-0">
                <div>
                  <p className="text-[10px] text-muted-foreground">Token</p>
                  <p className="text-xs font-medium tabular-nums text-card-foreground">
                    {activity.tokens > 0
                      ? activity.tokens.toLocaleString()
                      : "\u2014"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">延迟</p>
                  <p className="text-xs font-medium tabular-nums text-card-foreground">
                    {activity.latency}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
