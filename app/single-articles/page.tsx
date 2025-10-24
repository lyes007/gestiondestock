import { Suspense } from 'react'
import { InfiniteScrollSingleArticles } from '@/components/InfiniteScrollSingleArticles'
import { prisma } from '@/lib/prisma'

export default async function SingleArticlesPage() {
  // Get total count for initial load
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

  // Get initial groups (first 12)
  const initialInputCodes = inputCodeCounts
    .slice(0, 12)
    .map(item => item.inputCode)

  let initialGroups: Array<{ inputCode: string; articles: any[] }> = []

  if (initialInputCodes.length > 0) {
    const articles = await prisma.article.findMany({
      where: {
        exists: null,
        inputCode: { in: initialInputCodes }
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

    initialGroups = initialInputCodes.map(inputCode => ({
      inputCode,
      articles: groupedArticles[inputCode] || []
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Single Articles
        </h2>
        <p className="text-gray-600">
          Articles with only one variant per InputCode - no comparison needed
        </p>
      </div>


      <Suspense fallback={<SingleArticlesListSkeleton />}>
        <InfiniteScrollSingleArticles 
          initialGroups={initialGroups}
          totalGroups={totalGroups}
        />
      </Suspense>
    </div>
  )
}


function SingleArticlesListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="border rounded-lg p-3">
                  <div className="aspect-square bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
