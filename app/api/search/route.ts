import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const filter = searchParams.get('filter') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasMore: false
      })
    }

    const searchTerm = `%${query.toLowerCase()}%`

    // Build base where clause based on filter
    let baseWhere: any = {}
    
    switch (filter) {
      case 'single':
        // Single articles (only one article per inputCode)
        const singleInputCodes = await prisma.article.groupBy({
          by: ['inputCode'],
          where: { exists: null },
          _count: { inputCode: true },
          having: { inputCode: { _count: { equals: 1 } } }
        })
        baseWhere = {
          inputCode: { in: singleInputCodes.map(item => item.inputCode) },
          exists: null
        }
        break
      case 'not-found':
        // Not found articles
        const notFoundArticles = await prisma.notFoundArticle.findMany({
          where: {
            OR: [
              { code: { contains: query, mode: 'insensitive' } },
              { designation: { contains: query, mode: 'insensitive' } }
            ]
          },
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: 'desc' }
        })
        
        return NextResponse.json({
          results: notFoundArticles,
          total: notFoundArticles.length,
          page,
          totalPages: Math.ceil(notFoundArticles.length / limit),
          hasMore: notFoundArticles.length === limit
        })
      case 'renault-nissan-dacia':
        baseWhere = {
          exists: null,
          OR: [
            { oemNumbers: { some: { oemBrand: { in: ['RENAULT', 'NISSAN', 'DACIA'] } } } },
            { oemNumbers: { none: {} } }
          ]
        }
        break
      case 'renault-nissan-dacia-only':
        baseWhere = {
          exists: null,
          oemNumbers: { some: { oemBrand: { in: ['RENAULT', 'NISSAN', 'DACIA'] } } }
        }
        break
      case 'no-oem':
        baseWhere = {
          exists: null,
          oemNumbers: { none: {} }
        }
        break
      default: // 'all'
        baseWhere = { exists: null }
    }

    // Build search conditions
    const searchConditions = {
      ...baseWhere,
      OR: [
        { inputDesignation: { contains: query, mode: 'insensitive' } },
        { articleNo: { contains: query, mode: 'insensitive' } },
        { productName: { contains: query, mode: 'insensitive' } },
        { supplier: { name: { contains: query, mode: 'insensitive' } } },
        { oemNumbers: { some: { oemNumber: { contains: query, mode: 'insensitive' } } } },
        { oemNumbers: { some: { oemBrand: { contains: query, mode: 'insensitive' } } } }
      ]
    }

    // Get total count
    const total = await prisma.article.count({ where: searchConditions })

    // Get articles with relations
    const articles = await prisma.article.findMany({
      where: searchConditions,
      include: {
        supplier: true,
        oemNumbers: true,
        productImage: true
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { inputCode: 'asc' }
    })

    // Group articles by inputCode for display
    const groupedResults = articles.reduce((acc, article) => {
      const inputCode = article.inputCode
      if (!acc[inputCode]) {
        acc[inputCode] = []
      }
      acc[inputCode].push(article)
      return acc
    }, {} as Record<string, typeof articles>)

    const results = Object.entries(groupedResults).map(([inputCode, articles]) => ({
      inputCode,
      articles
    }))

    return NextResponse.json({
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search articles' },
      { status: 500 }
    )
  }
}
