"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-client'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // 只在客户端检查认证状态
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)
      setIsChecking(false)

      if (!authenticated && pathname !== '/login' && pathname !== '/register') {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, pathname])

  // 在检查完成前，显示与布局一致的加载态，避免页面闪黑
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // 如果未登录，不渲染子组件
  if (!isAuth) {
    return null
  }

  return <>{children}</>
}
