"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Key,
  BarChart3,
  Settings,
  CreditCard,
  BookOpen,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { icon: LayoutDashboard, label: "概览", id: "overview", active: true },
  { icon: Zap, label: "模型", id: "models" },
  { icon: Key, label: "API 密钥", id: "keys" },
  { icon: BarChart3, label: "用量分析", id: "analytics" },
  { icon: CreditCard, label: "账单", id: "billing" },
  { icon: BookOpen, label: "文档", id: "docs" },
  { icon: Settings, label: "设置", id: "settings" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("overview")

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Layers className="size-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
              OpenRouter
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = activeItem === item.id
              return (
                <li key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveItem(item.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="text-xs">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border p-2">
          {/* Plan badge */}
          {!collapsed && (
            <div className="mb-2 rounded-md bg-sidebar-accent px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">当前方案</span>
                <Badge variant="secondary" className="text-[10px] bg-primary/15 text-primary border-0">
                  Pro
                </Badge>
              </div>
              <p className="mt-1 text-xs text-sidebar-foreground font-medium">$42.80 / $100.00</p>
              <div className="mt-1.5 h-1 rounded-full bg-border">
                <div className="h-full w-[43%] rounded-full bg-primary" />
              </div>
            </div>
          )}

          {/* User */}
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                ZL
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-sidebar-foreground">Zhang Lei</p>
                  <p className="text-[10px] text-muted-foreground">zhang@example.com</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <LogOut className="size-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-1 flex w-full items-center justify-center rounded-md py-1.5 text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
