import { prisma } from '@/lib/prisma'
import { ArticleGroup } from './ArticleGroup'
import { PaginationControls } from './PaginationControls'

interface ArticleListProps {
  page?: number
}

export async function ArticleList({ page = 1 }: ArticleListProps) {
  const ITEMS_PER_PAGE = 4

  // Get inputCodes that have multiple articles with exists: null
  const inputCodeCounts = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { exists: null },
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

  const uniqueInputCodes = inputCodeCounts.map(item => ({ inputCode: item.inputCode }))

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
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No multiple articles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No InputCodes with multiple unmarked articles found. All remaining articles are unique.
          </p>
        </div>
      </div>
    )
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, totalGroups)} of {totalGroups} groups with multiple articles
        </div>
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          totalGroups={totalGroups}
        />
      </div>

      {groups.map((group) => (
        <ArticleGroup
          key={group.inputCode}
          inputCode={group.inputCode}
          articles={group.articles}
        />
      ))}

      <div className="flex justify-center">
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          totalGroups={totalGroups}
        />
      </div>
    </div>
  )
}
