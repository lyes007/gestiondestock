import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const query = searchParams.get('q') || ''
    const ITEMS_PER_PAGE = 12

    // If there's a search query, use the search API instead
    if (query.trim()) {
      const searchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search?q=${encodeURIComponent(query)}&filter=not-found&page=${page}&limit=${ITEMS_PER_PAGE}`)
      const searchData = await searchResponse.json()
      
      // Transform search results to match not-found articles format
      const articles = searchData.results?.map((result: any) => ({
        id: result.id || Math.random(),
        code: result.code,
        designation: result.designation,
        status: result.status || 'NOT_FOUND',
        timestamp: result.timestamp ? new Date(result.timestamp) : new Date(),
        createdAt: result.timestamp ? new Date(result.timestamp) : new Date(),
        updatedAt: result.timestamp ? new Date(result.timestamp) : new Date()
      })) || []
      
      return NextResponse.json({
        articles,
        totalArticles: searchData.total || 0,
        hasMore: searchData.hasMore || false,
        currentPage: page
      })
    }

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

