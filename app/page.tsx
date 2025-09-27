import { Suspense } from 'react'
import { ArticleList } from '@/components/ArticleList'
import { StatsCard } from '@/components/StatsCard'

interface HomeProps {
  searchParams: { page?: string }
}

export default function Home({ searchParams }: HomeProps) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Multiple Articles Comparison
        </h2>
        <p className="text-gray-600">
          InputCodes with multiple articles that need to be compared and marked as existing or not
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsCard />
      </Suspense>

      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleList page={page} />
      </Suspense>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}

function ArticleListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Pagination skeleton */}
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Article groups skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="border rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom pagination skeleton */}
      <div className="flex justify-center animate-pulse">
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
