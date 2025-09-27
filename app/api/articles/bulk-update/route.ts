import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { inputCode, exists } = await request.json()

    if (typeof inputCode !== 'string' || typeof exists !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const result = await prisma.article.updateMany({
      where: { 
        inputCode,
        exists: null // Only update unmarked articles
      },
      data: { exists }
    })

    return NextResponse.json({ 
      success: true, 
      updatedCount: result.count,
      inputCode,
      exists 
    })
  } catch (error) {
    console.error('Error bulk updating articles:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update articles' },
      { status: 500 }
    )
  }
}
