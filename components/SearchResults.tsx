'use client'

import { useState, useEffect } from 'react'
import { ArticleGroup } from './ArticleGroup'
import { NotFoundArticleCard } from './NotFoundArticleCard'
import { SingleArticleCard } from './SingleArticleCard'

interface SearchResultsProps {
  query: string
  filter: string
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
}

interface SearchResult {
  inputCode?: string
  articles?: any[]
  code?: string
  designation?: string
  status?: string
  timestamp?: string
}

export function SearchResults({ query, filter, onLoadMore, hasMore, isLoading }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setTotal(0)
      return
    }

    const performSearch = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&filter=${filter}&page=1&limit=12`)
        const data = await response.json()
        
        setResults(data.results || [])
        setTotal(data.total || 0)
        setPage(1)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, filter])

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&filter=${filter}&page=${nextPage}&limit=12`)
      const data = await response.json()
      
      setResults(prev => [...prev, ...(data.results || [])])
      setPage(nextPage)
    } catch (error) {
      console.error('Load more error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
        <p className="text-gray-500">Enter a search term to find articles</p>
      </div>
    )
  }

  if (loading && results.length === 0) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
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

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-500">Try adjusting your search terms or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results
          </h3>
          <p className="text-sm text-gray-600">
            Found {total.toLocaleString()} result{total !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {results.map((result, index) => {
          // Handle not found articles
          if (filter === 'not-found' && result.code) {
            return (
              <NotFoundArticleCard
                key={`${result.code}-${index}`}
                article={{
                  id: index,
                  code: result.code,
                  designation: result.designation || '',
                  status: result.status || 'NOT_FOUND',
                  timestamp: result.timestamp ? new Date(result.timestamp) : new Date(),
                  createdAt: result.timestamp ? new Date(result.timestamp) : new Date(),
                  updatedAt: result.timestamp ? new Date(result.timestamp) : new Date()
                }}
              />
            )
          }

          // Handle grouped articles
          if (result.inputCode && result.articles) {
            // Check if it's a single article
            if (result.articles.length === 1) {
              return (
                <SingleArticleCard
                  key={`${result.inputCode}-${index}`}
                  article={result.articles[0]}
                />
              )
            }

            // Multiple articles - show as group
            return (
              <ArticleGroup
                key={`${result.inputCode}-${index}`}
                inputCode={result.inputCode}
                articles={result.articles}
              />
            )
          }

          return null
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Results'}
          </button>
        </div>
      )}
    </div>
  )
}
