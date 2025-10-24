import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const ITEMS_PER_PAGE = 12

    const totalArticles = await prisma.notFoundArticle.count()
    const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE)
    const currentPage = Math.min(Math.max(page, 1), totalPages)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    const articles = await prisma.notFoundArticle.findMany({
      skip: startIndex,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      articles,
      totalArticles,
      hasMore: currentPage < totalPages,
      currentPage
    })

  } catch (error) {
    console.error('Error fetching not found articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch not found articles' },
      { status: 500 }
    )
  }
}

