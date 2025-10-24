import { prisma } from '@/lib/prisma'
import { ArticleGroup } from './ArticleGroup'
import { PaginationControls } from './PaginationControls'

interface ArticleListProps {
  page?: number
  filter?: string
}

export async function ArticleList({ page = 1, filter = 'all' }: ArticleListProps) {
  const ITEMS_PER_PAGE = 12

  // Build where clause based on filter
  let whereClause: any = { exists: null }
  
  if (filter === 'renault-nissan-dacia') {
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

  const uniqueInputCodes = inputCodeCounts.map((item: { inputCode: string }) => ({ inputCode: item.inputCode }))

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
    const getFilterMessage = () => {
      switch (filter) {
        case 'renault-nissan-dacia':
          return 'No InputCodes with multiple RENAULT/NISSAN/DACIA or No OEM articles found.'
        case 'renault-nissan-dacia-only':
          return 'No InputCodes with multiple RENAULT/NISSAN/DACIA articles found.'
        case 'no-oem':
          return 'No InputCodes with multiple articles without OEM numbers found.'
        default:
          return 'No InputCodes with multiple unmarked articles found. All remaining articles are unique.'
      }
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {getFilterMessage()}
          </p>
        </div>
      </div>
    )
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, totalGroups)} of {totalGroups} groups with multiple articles
          {filter !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {filter === 'renault-nissan-dacia' ? 'RENAULT/NISSAN/DACIA + No OEM' : 
               filter === 'renault-nissan-dacia-only' ? 'RENAULT/NISSAN/DACIA Only' :
               filter === 'no-oem' ? 'No OEM Numbers' : ''}
            </span>
          )}
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
