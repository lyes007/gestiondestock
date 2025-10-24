'use client'

import { useState, useEffect, useCallback } from 'react'
import { NotFoundArticleCard } from './NotFoundArticleCard'

interface NotFoundArticle {
  id: number
  code: string
  designation: string | null
  status: string
  timestamp: Date
  createdAt: Date
  updatedAt: Date
}

interface InfiniteScrollNotFoundArticlesProps {
  initialArticles: NotFoundArticle[]
  totalArticles: number
}

export function InfiniteScrollNotFoundArticles({ 
  initialArticles, 
  totalArticles
}: InfiniteScrollNotFoundArticlesProps) {
  const [articles, setArticles] = useState(initialArticles)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialArticles.length < totalArticles)
  const [currentPage, setCurrentPage] = useState(1)

  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = currentPage + 1
      const response = await fetch(`/api/not-found-articles?page=${nextPage}`)
      const data = await response.json()
      
      if (data.articles && data.articles.length > 0) {
        setArticles(prev => [...prev, ...data.articles])
        setCurrentPage(nextPage)
        setHasMore(data.articles.length === 12) // Assuming 12 items per page
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more articles:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, currentPage])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreArticles()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreArticles])

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No not found articles</h3>
          <p className="mt-1 text-sm text-gray-500">
            All articles were found in TecDoc API.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {articles.length} of {totalArticles} not found articles
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {articles.map((article) => (
          <NotFoundArticleCard key={article.id} article={article} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Loading more not found articles...</span>
          </div>
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No more not found articles to load</p>
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMoreArticles}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Load More Not Found Articles
          </button>
        </div>
      )}
    </div>
  )
}

