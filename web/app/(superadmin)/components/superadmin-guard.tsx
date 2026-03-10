"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isSuperadmin } from '@/lib/auth-client'

interface SuperadminGuardProps {
  children: React.ReactNode
}

export function SuperadminGuard({ children }: SuperadminGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // 只在客户端检查权限
    const checkAuth = () => {
      const isSuperadminUser = isSuperadmin()
      setIsAuthorized(isSuperadminUser)
      setIsChecking(false)

      if (!isSuperadminUser) {
        // 如果不是超级管理员，重定向到 dashboard
        router.push('/dashboard')
      }
    }

    checkAuth()
  }, [router, pathname])

  // 在检查完成前，不渲染任何内容
  if (isChecking) {
    return null
  }

  // 如果未授权，不渲染子组件
  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
