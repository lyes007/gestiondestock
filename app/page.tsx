import { Suspense } from 'react'
import { MainPageContent } from '@/components/MainPageContent'
import { prisma } from '@/lib/prisma'

interface HomeProps {
  searchParams: { page?: string; filter?: string }
}

export default async function Home({ searchParams }: HomeProps) {
  const filter = searchParams.filter || 'all'

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

  // Get total count for initial load
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

  const totalGroups = inputCodeCounts.length

  // Get initial groups (first 12)
  const initialInputCodes = inputCodeCounts
    .slice(0, 12)
    .map(item => item.inputCode)

  let initialGroups: Array<{ inputCode: string; articles: any[] }> = []

  if (initialInputCodes.length > 0) {
    const articles = await prisma.article.findMany({
      where: { 
        ...whereClause,
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
          Multiple Articles Comparison
        </h2>
        <p className="text-gray-600">
          InputCodes with multiple articles that need to be compared and marked as existing or not
        </p>
        
        {/* Filter Options */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`/?filter=all`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            All Articles (1,064)
          </a>
          <a
            href={`/?filter=renault-nissan-dacia`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'renault-nissan-dacia' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            RENAULT/NISSAN/DACIA + No OEM (744)
          </a>
          <a
            href={`/?filter=renault-nissan-dacia-only`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'renault-nissan-dacia-only' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            RENAULT/NISSAN/DACIA Only (366)
          </a>
          <a
            href={`/?filter=no-oem`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'no-oem' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            No OEM Numbers (412)
          </a>
          <a
            href="/single-articles"
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
          >
            📋 Single Articles (862)
          </a>
          <a
            href="/not-found"
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
          >
            ❌ Not Found (1,437)
          </a>
        </div>
      </div>


      <MainPageContent
        initialGroups={initialGroups}
        totalGroups={totalGroups}
        filter={filter}
      />
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
