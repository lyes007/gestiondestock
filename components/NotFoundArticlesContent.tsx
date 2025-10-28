'use client'

import { useState, Suspense } from 'react'
import { InfiniteScrollNotFoundArticles } from './InfiniteScrollNotFoundArticles'
import { SearchBar } from './SearchBar'
import { SearchResults } from './SearchResults'

interface NotFoundArticle {
  id: number
  code: string
  designation: string | null
  status: string
  timestamp: Date
  createdAt: Date
  updatedAt: Date
}

interface NotFoundArticlesContentProps {
  initialArticles: NotFoundArticle[]
  totalArticles: number
}

export function NotFoundArticlesContent({ initialArticles, totalArticles }: NotFoundArticlesContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('not-found')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (query: string, searchFilter: string) => {
    setSearchQuery(query)
    setSearchFilter(searchFilter)
    setIsSearching(query.trim().length > 0)
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search not found articles by code or designation..."
          className="w-full"
        />
      </div>

      {/* Content */}
      {isSearching ? (
        <SearchResults
          query={searchQuery}
          filter={searchFilter}
          hasMore={true}
          isLoading={false}
        />
      ) : (
        <Suspense fallback={<NotFoundArticlesListSkeleton />}>
          <InfiniteScrollNotFoundArticles 
            initialArticles={initialArticles}
            totalArticles={totalArticles}
          />
        </Suspense>
      )}
    </div>
  )
}

function NotFoundArticlesListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  )
}

