import { Suspense } from 'react'
import { InfiniteScrollNotFoundArticles } from '@/components/InfiniteScrollNotFoundArticles'
import { NotFoundArticlesContent } from '@/components/NotFoundArticlesContent'
import { prisma } from '@/lib/prisma'

export default async function NotFoundArticlesPage() {
  // Get total count for initial load
  const totalNotFound = await prisma.notFoundArticle.count()

  // Get initial articles (first 12)
  const initialArticles = await prisma.notFoundArticle.findMany({
    take: 12,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Not Found Articles
          </h2>
          <p className="text-gray-600">
            Articles that were not found in TecDoc API - {totalNotFound} total articles
          </p>
        </div>

        <Suspense fallback={<NotFoundArticlesListSkeleton />}>
          <NotFoundArticlesContent 
            initialArticles={initialArticles}
            totalArticles={totalNotFound}
          />
        </Suspense>
      </div>
    </div>
  )
}


function NotFoundArticlesListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="border rounded-lg p-3">
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

