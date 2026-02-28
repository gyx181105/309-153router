import { NextRequest, NextResponse } from 'next/server'
import { createApiKey, revokeApiKey } from '@/lib/auth'
import { prisma } from '@/lib/db'

function getCurrentUserId(request: NextRequest): string | null {
  const userId = request.headers.get('x-user-id')
  return userId
}

export async function POST(request: NextRequest) {
  const userId = getCurrentUserId(request)
  if (!userId) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', type: 'authentication_error' } },
      { status: 401 }
    )
  }

  let body: { name?: string; rateLimitPerMin?: number } = {}
  try {
    body = await request.json()
  } catch {
  }

  try {
    const apiKey = await createApiKey(userId, body.name, body.rateLimitPerMin)

    return NextResponse.json({
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
      rate_limit: apiKey.rateLimitPerMin,
      status: apiKey.status,
      created_at: apiKey.createdAt.toISOString(),
      last_used_at: apiKey.lastUsedAt?.toISOString() || null,
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create API key:', error)
    return NextResponse.json(
      { error: { message: 'Failed to create API key', type: 'internal_error' } },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const userId = getCurrentUserId(request)
  if (!userId) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', type: 'authentication_error' } },
      { status: 401 }
    )
  }

  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        status: true,
        rateLimitPerMin: true,
        createdAt: true,
        lastUsedAt: true,
      },
    })

    const maskedKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name || 'API Key',
      masked_key: `sk-${key.id.slice(0, 8)}...`,
      status: key.status,
      rate_limit: key.rateLimitPerMin,
      created_at: key.createdAt.toISOString(),
      last_used_at: key.lastUsedAt?.toISOString() || null,
    }))

    return NextResponse.json({ data: maskedKeys })
  } catch (error) {
    console.error('Failed to fetch API keys:', error)
    return NextResponse.json(
      { error: { message: 'Failed to fetch API keys', type: 'internal_error' } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const userId = getCurrentUserId(request)
  if (!userId) {
    return NextResponse.json(
      { error: { message: 'Unauthorized', type: 'authentication_error' } },
      { status: 401 }
    )
  }

  let body: { key_id: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { message: 'Missing key_id in request body', type: 'invalid_request_error' } },
      { status: 400 }
    )
  }

  const existingKey = await prisma.apiKey.findFirst({
    where: { id: body.key_id, userId },
  })

  if (!existingKey) {
    return NextResponse.json(
      { error: { message: 'API key not found', type: 'not_found' } },
      { status: 404 }
    )
  }

  try {
    await revokeApiKey(body.key_id)
    return NextResponse.json({ success: true, message: 'API key revoked' })
  } catch (error) {
    console.error('Failed to revoke API key:', error)
    return NextResponse.json(
      { error: { message: 'Failed to revoke API key', type: 'internal_error' } },
      { status: 500 }
    )
  }
}
