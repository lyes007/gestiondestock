import { prisma } from '@/lib/prisma'
import { SingleArticleCard } from './SingleArticleCard'

export async function SingleArticlesList() {
  // Get inputCodes that have exactly one article
  const singleArticleGroups = await prisma.article.groupBy({
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

  if (singleArticleGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No single articles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No articles with single variants found.
          </p>
        </div>
      </div>
    )
  }

  // Get the actual articles
  const articles = await prisma.article.findMany({
    where: {
      exists: null,
      inputCode: {
        in: singleArticleGroups.map(g => g.inputCode)
      }
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

  // Group articles by inputCode for display
  const groupedArticles = articles.reduce((acc, article) => {
    const inputCode = article.inputCode
    if (!acc[inputCode]) {
      acc[inputCode] = []
    }
    acc[inputCode].push(article)
    return acc
  }, {} as Record<string, typeof articles>)

  const groups = singleArticleGroups.map(item => ({
    inputCode: item.inputCode,
    articles: groupedArticles[item.inputCode] || []
  }))

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {groups.length} single articles (one article per InputCode)
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.inputCode} className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Input Code: {group.inputCode}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">1</span> article (single variant)
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {group.articles.map((article) => (
                <SingleArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

