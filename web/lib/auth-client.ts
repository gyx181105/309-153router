/**
 * 客户端认证工具函数
 * 用于从 localStorage 获取用户信息
 */

/**
 * 获取当前登录用户的 ID
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('user_id')
}

/**
 * 获取当前登录用户的邮箱
 */
export function getCurrentUserEmail(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('email')
}

/**
 * 获取当前登录用户的 Token
 */
export function getCurrentUserToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('token')
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  const userId = getCurrentUserId()
  const token = getCurrentUserToken()
  return !!(userId && token)
}

/**
 * 保存用户登录信息
 */
export function saveUserAuth(userId: string, email: string, token: string, role?: string): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem('user_id', userId)
  localStorage.setItem('email', email)
  localStorage.setItem('token', token)
  if (role) {
    localStorage.setItem('role', role)
  }
}

/**
 * 获取当前登录用户的角色
 */
export function getCurrentUserRole(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('role')
}

/**
 * 检查当前用户是否为超级管理员
 */
export function isSuperadmin(): boolean {
  const role = getCurrentUserRole()
  return role === 'superadmin'
}

/**
 * 获取带认证信息的请求头（用于 fetch 调用）
 */
export function getAuthHeaders(): Record<string, string> {
  const userId = getCurrentUserId()
  if (userId) {
    return { 'x-user-id': userId }
  }
  return {}
}

/**
 * 清除用户登录信息
 */
export function clearUserAuth(): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem('user_id')
  localStorage.removeItem('email')
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}
