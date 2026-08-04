import { NextRequest, NextResponse } from 'next/server'
import {
  checkPaymentStatusByBizOrderNo,
  checkPaymentStatusByGatewayOrderNo,
  checkPaymentStatusService,
} from '@/app/[locale]/(recharge)/domain/recharge.service'

/**
 * 支付宝回跳后补查单入账（不依赖 locale）
 * POST /api/recharge/sync-status
 * body: { orderId?: string, gatewayOrderNo?: string, bizOrderNo?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const orderId = typeof body.orderId === 'string' ? body.orderId : ''
    const gatewayOrderNo =
      typeof body.gatewayOrderNo === 'string' ? body.gatewayOrderNo : ''
    const bizOrderNo = typeof body.bizOrderNo === 'string' ? body.bizOrderNo : ''

    if (!orderId && !gatewayOrderNo && !bizOrderNo) {
      return NextResponse.json(
        { ok: false, error: '缺少 orderId、gatewayOrderNo 或 bizOrderNo' },
        { status: 400 }
      )
    }

    const result = orderId
      ? await checkPaymentStatusService(orderId)
      : gatewayOrderNo
        ? await checkPaymentStatusByGatewayOrderNo(gatewayOrderNo)
        : await checkPaymentStatusByBizOrderNo(bizOrderNo)

    return NextResponse.json({ ok: true, data: result })
  } catch (error) {
    console.error('补查支付状态异常:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : '查询失败',
      },
      { status: 500 }
    )
  }
}
