import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function getCurrentUserId(request: NextRequest): string | null {
  const userId = request.headers.get('x-user-id')
  return userId
}

export async function GET(request: NextRequest) {
  const userId = getCurrentUserId(request)
  if (!userId) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', type: 'authentication_error' } },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const days = parseInt(searchParams.get('days') || '30', 10)
  const model = searchParams.get('model')

  if (days < 1 || days > 365) {
    return NextResponse.json(
      { error: { message: 'Invalid days parameter', type: 'invalid_request_error' } },
      { status: 400 }
    )
  }

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    const whereClause: Record<string, unknown> = {
      userId,
      createdAt: {
        gte: startDate,
      },
    }

    if (model) {
      whereClause.model = model
    }

    const usageLogs = await prisma.usageLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    let totalInputTokens = 0
    let totalOutputTokens = 0
    let totalCost = 0
    const modelBreakdown: Record<string, { tokens: number; cost: number; requests: number }> = {}

    for (const log of usageLogs) {
      totalInputTokens += log.inputTokens
      totalOutputTokens += log.outputTokens
      totalCost += Number(log.cost)

      const modelKey = log.model
      if (!modelBreakdown[modelKey]) {
        modelBreakdown[modelKey] = {
          tokens: 0,
          cost: 0,
          requests: 0,
        }
      }
      modelBreakdown[modelKey].tokens += log.inputTokens + log.outputTokens
      modelBreakdown[modelKey].cost += Number(log.cost)
      modelBreakdown[modelKey].requests += 1
    }

    const dailyUsage: Record<string, { tokens: number; cost: number; requests: number }> = {}
    for (const log of usageLogs) {
      const dateKey = log.createdAt.toISOString().split('T')[0]
      if (!dailyUsage[dateKey]) {
        dailyUsage[dateKey] = { tokens: 0, cost: 0, requests: 0 }
      }
      dailyUsage[dateKey].tokens += log.inputTokens + log.outputTokens
      dailyUsage[dateKey].cost += Number(log.cost)
      dailyUsage[dateKey].requests += 1
    }

    return NextResponse.json({
      period: {
        days,
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString(),
      },
      summary: {
        total_requests: usageLogs.length,
        total_input_tokens: totalInputTokens,
        total_output_tokens: totalOutputTokens,
        total_tokens: totalInputTokens + totalOutputTokens,
        total_cost: totalCost,
      },
      model_breakdown: modelBreakdown,
      daily_usage: dailyUsage,
    })
  } catch (error) {
    console.error('Failed to fetch usage stats:', error)
    return NextResponse.json(
      { error: { message: 'Failed to fetch usage stats', type: 'internal_error' } },
      { status: 500 }
    )
  }
}
