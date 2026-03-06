/**
 * Superadmin 邀请奖励设置 API
 * GET /api/superadmin/invite-rewards  - 获取首充奖励规则
 * PATCH /api/superadmin/invite-rewards - 更新首充奖励金额/启用状态
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  getRechargeRewardRuleForAdmin,
  updateRechargeRewardRuleForAdmin,
} from '@/app/(invite)/domain/invite.repo'

export async function GET() {
  try {
    const rule = await getRechargeRewardRuleForAdmin()
    return NextResponse.json({
      success: true,
      data: {
        rechargeReward: rule
          ? {
              id: rule.id,
              inviteCount: rule.inviteCount,
              rewardType: rule.rewardType,
              rewardValue: rule.rewardValue,
              rewardName: rule.rewardName,
              isActive: rule.isActive,
            }
          : null,
      },
    })
  } catch (error: unknown) {
    console.error('Superadmin invite-rewards GET error:', error)
    return NextResponse.json(
      {
        success: false,
        detail: error instanceof Error ? error.message : '获取邀请奖励设置失败',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const rewardValue =
      typeof body.rewardValue === 'number' ? body.rewardValue : undefined
    const isActive =
      typeof body.isActive === 'boolean' ? body.isActive : undefined
    const updated = await updateRechargeRewardRuleForAdmin({
      rewardValue,
      isActive,
    })
    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        inviteCount: updated.inviteCount,
        rewardType: updated.rewardType,
        rewardValue: updated.rewardValue,
        rewardName: updated.rewardName,
        isActive: updated.isActive,
      },
    })
  } catch (error: unknown) {
    console.error('Superadmin invite-rewards PATCH error:', error)
    return NextResponse.json(
      {
        success: false,
        detail: error instanceof Error ? error.message : '更新邀请奖励设置失败',
      },
      { status: 500 }
    )
  }
}
