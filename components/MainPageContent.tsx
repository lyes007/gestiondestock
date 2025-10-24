'use client'

import { useState, Suspense } from 'react'
import { InfiniteScrollArticleList } from './InfiniteScrollArticleList'
import { SearchBar } from './SearchBar'
import { SearchResults } from './SearchResults'

interface MainPageContentProps {
  initialGroups: any[]
  totalGroups: number
  filter: string
}

export function MainPageContent({ initialGroups, totalGroups, filter }: MainPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('all')
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
          placeholder="Search articles by designation, OEM number, article number, product name, supplier..."
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
        <Suspense fallback={<ArticleListSkeleton />}>
          <InfiniteScrollArticleList 
            initialGroups={initialGroups}
            totalGroups={totalGroups}
            filter={filter}
          />
        </Suspense>
      )}
    </div>
  )
}

function ArticleListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
