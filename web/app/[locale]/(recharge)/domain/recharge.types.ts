/**
 * 充值模块类型定义
 */

/** 支付渠道（与 PayRouter pay_provider 一致） */
export type PayProvider = 'WECHAT' | 'ALIPAY' | 'STRIPE'

export const PAY_PROVIDERS: readonly PayProvider[] = ['WECHAT', 'ALIPAY', 'STRIPE'] as const

/** 按渠道选择 PayRouter pay_method */
export function payMethodForProvider(provider: PayProvider): 'NATIVE' | 'H5' {
  if (provider === 'STRIPE') return 'H5'
  // 支付宝：H5/电脑网站跳转收银台（PayRouter 无 PAGE，用 H5 拿 pay_url）
  if (provider === 'ALIPAY') return 'H5'
  // 微信：本地展示二维码扫码
  return 'NATIVE'
}

export interface RechargeOrder {
  id: string
  userId: string
  bizOrderNo: string
  gatewayOrderNo: string | null
  amount: number
  payProvider: PayProvider
  status: 'pending' | 'paid' | 'failed' | 'canceled'
  qrcodeUrl: string | null
  processed: boolean
  createdAt: Date
  updatedAt: Date
  paidAt: Date | null
}

export interface CreateRechargeOrderParams {
  userId: string
  amount: number
  payProvider: PayProvider
  /** 用于 Stripe Checkout 回跳路径，如 zh / en / ja */
  locale?: string
}

export type StripeChargeStatus = 'succeeded' | 'requires_action' | 'pending'

export interface CreateRechargeOrderResult {
  orderId: string
  bizOrderNo: string
  /** 微信扫码 URL；支付宝跳转时为空 */
  qrcodeUrl: string
  /** 支付宝电脑收银台 / Stripe Checkout 跳转链接 */
  payUrl?: string
  amount: number
  payProvider: PayProvider
  /** Stripe 直扣状态（P1.5） */
  stripeChargeStatus?: StripeChargeStatus
  /** 3DS 确认用 client_secret */
  clientSecret?: string
  requiresAction?: boolean
  /** 直扣已成功且本地已入账 */
  paid?: boolean
}

export interface PaymentNotifyData {
  biz_order_no: string
  gateway_order_no: string
  status: string
  amount: number
  sign: string
  [key: string]: unknown
}

// 充值金额配置
export const STRIPE_CHARGE_CURRENCY = 'USD' as const

export function getUsdToCnyRate(): number {
  const rate = parseFloat(
    process.env.RECHARGE_USD_TO_CNY_RATE ||
      process.env.NEXT_PUBLIC_RECHARGE_USD_TO_CNY_RATE ||
      '7.2'
  )
  return Number.isFinite(rate) && rate > 0 ? rate : 7.2
}

/** Stripe 扣款 USD → 入账余额 CNY（元） */
export function stripeUsdToCreditCny(usd: number): number {
  return Math.round(usd * getUsdToCnyRate() * 100) / 100
}

export function rechargePayCurrency(provider: PayProvider): 'CNY' | 'USD' {
  return provider === 'STRIPE' ? 'USD' : 'CNY'
}

export function formatRechargeMoney(provider: PayProvider, amount: number): string {
  return provider === 'STRIPE' ? `$${amount.toFixed(2)}` : `¥${amount.toFixed(2)}`
}

export const RECHARGE_AMOUNTS = {
  MIN: 1, // 微信/支付宝最小充值（元）
  /** Stripe 扣款最低 USD（Stripe 结算 USD 时最低约 $0.50，产品取 $1） */
  STRIPE_MIN: 1,
  STRIPE_MAX: 1000,
  MAX: 10000,
  PRESET: [10, 50, 100],
  /** Stripe 快捷金额（USD） */
  STRIPE_PRESET: [1, 5, 10, 50],
} as const
