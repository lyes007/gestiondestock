import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const ITEMS_PER_PAGE = 12

    // Get inputCodes that have exactly one article
    const inputCodeCounts = await prisma.article.groupBy({
      by: ['inputCode'],
      where: { exists: null },
      _count: {
        inputCode: true
      },
      having: {
        inputCode: {
          _count: {
            equals: 1
          }
        }
      },
      orderBy: { inputCode: 'asc' }
    })

    const totalGroups = inputCodeCounts.length
    const totalPages = Math.ceil(totalGroups / ITEMS_PER_PAGE)
    const currentPage = Math.min(Math.max(page, 1), totalPages)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    // Get inputCodes for current page
    const currentPageInputCodes = inputCodeCounts
      .slice(startIndex, endIndex)
      .map((item: { inputCode: string; _count: { inputCode: number } }) => item.inputCode)

    if (currentPageInputCodes.length === 0) {
      return NextResponse.json({ 
        groups: [], 
        totalGroups: 0, 
        hasMore: false 
      })
    }

    // Get articles for current page inputCodes
    const articles = await prisma.article.findMany({
      where: {
        exists: null,
        inputCode: { in: currentPageInputCodes }
      },
      include: {
        supplier: true,
        oemNumbers: true,
        productImage: true
      },
      orderBy: [
        { inputCode: 'asc' },
        { productName: 'asc' }
      ]
    })

    // Group articles by inputCode
    const groupedArticles = articles.reduce((acc: Record<string, typeof articles>, article: typeof articles[0]) => {
      const inputCode = article.inputCode
      if (!acc[inputCode]) {
        acc[inputCode] = []
      }
      acc[inputCode].push(article)
      return acc
    }, {} as Record<string, typeof articles>)

    const groups = currentPageInputCodes.map((inputCode: string) => ({
      inputCode,
      articles: groupedArticles[inputCode] || []
    }))

    return NextResponse.json({
      groups,
      totalGroups,
      hasMore: currentPage < totalPages,
      currentPage
    })

  } catch (error) {
    console.error('Error fetching single articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch single articles' },
      { status: 500 }
    )
  }
}

