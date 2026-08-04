import { NextRequest, NextResponse } from 'next/server'
import { handlePaymentNotify } from '@/app/[locale]/(recharge)/domain/recharge.service'
import { paymentNotifySchema } from '@/app/[locale]/(recharge)/domain/recharge.schema'

/**
 * 支付成功异步通知（PayRouter → OptRouter）
 * POST /api/recharge/notify
 *
 * 注意：必须挂在无 locale 路径下；PayRouter 配置的 notify_url 不含 /zh。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = paymentNotifySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: validation.error.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }

    const result = await handlePaymentNotify(body)

    if (result.ok) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 200 }
    )
  } catch (error) {
    console.error('支付回调处理异常:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : '处理异常' },
      { status: 200 }
    )
  }
}
