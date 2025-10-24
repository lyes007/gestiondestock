import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const filter = searchParams.get('filter') || 'all'
    const ITEMS_PER_PAGE = 12

    // Build where clause based on filter
    let whereClause: any = { exists: null }
    
    if (filter === 'renault-nissan-dacia') {
      whereClause = {
        exists: null,
        OR: [
          {
            oemNumbers: {
              some: {
                oemBrand: {
                  in: ['RENAULT', 'NISSAN', 'DACIA']
                }
              }
            }
          },
          {
            oemNumbers: {
              none: {}
            }
          }
        ]
      }
    } else if (filter === 'renault-nissan-dacia-only') {
      whereClause = {
        exists: null,
        oemNumbers: {
          some: {
            oemBrand: {
              in: ['RENAULT', 'NISSAN', 'DACIA']
            }
          }
        }
      }
    } else if (filter === 'no-oem') {
      whereClause = {
        exists: null,
        oemNumbers: {
          none: {}
        }
      }
    }

    // Get inputCodes that have multiple articles with exists: null
    const inputCodeCounts = await prisma.article.groupBy({
      by: ['inputCode'],
      where: whereClause,
      _count: {
        inputCode: true
      },
      having: {
        inputCode: {
          _count: {
            gt: 1
          }
        }
      },
      orderBy: { inputCode: 'asc' }
    })

    const uniqueInputCodes = inputCodeCounts.map((item: { inputCode: string; _count: { inputCode: number } }) => ({ inputCode: item.inputCode }))
    const totalGroups = uniqueInputCodes.length
    const totalPages = Math.ceil(totalGroups / ITEMS_PER_PAGE)
    const currentPage = Math.min(Math.max(page, 1), totalPages)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    // Get inputCodes for current page
    const currentPageInputCodes = uniqueInputCodes
      .slice(startIndex, endIndex)
      .map(item => item.inputCode)

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
        ...whereClause,
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
    const groupedArticles = articles.reduce((acc, article) => {
      const inputCode = article.inputCode
      if (!acc[inputCode]) {
        acc[inputCode] = []
      }
      acc[inputCode].push(article)
      return acc
    }, {} as Record<string, typeof articles>)

    const groups = currentPageInputCodes.map(inputCode => ({
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
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
