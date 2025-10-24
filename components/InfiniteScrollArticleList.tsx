'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArticleGroup } from './ArticleGroup'
import { Article } from '@/lib/types'

interface InfiniteScrollArticleListProps {
  initialGroups: Array<{
    inputCode: string
    articles: Article[]
  }>
  totalGroups: number
  filter: string
}

export function InfiniteScrollArticleList({ 
  initialGroups, 
  totalGroups, 
  filter 
}: InfiniteScrollArticleListProps) {
  const [groups, setGroups] = useState(initialGroups)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialGroups.length < totalGroups)
  const [currentPage, setCurrentPage] = useState(1)

  const loadMoreGroups = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = currentPage + 1
      const response = await fetch(`/api/articles?page=${nextPage}&filter=${filter}`)
      const data = await response.json()
      
      if (data.groups && data.groups.length > 0) {
        setGroups(prev => [...prev, ...data.groups])
        setCurrentPage(nextPage)
        setHasMore(data.groups.length === 12) // Assuming 12 items per page
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more groups:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, currentPage, filter])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreGroups()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreGroups])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {groups.length} of {totalGroups} groups with multiple articles
          {filter !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {filter === 'renault-nissan-dacia' ? 'RENAULT/NISSAN/DACIA' : 
               filter === 'no-oem' ? 'No OEM Numbers' : ''}
            </span>
          )}
        </div>
      </div>

      {groups.map((group) => (
        <ArticleGroup
          key={group.inputCode}
          inputCode={group.inputCode}
          articles={group.articles}
        />
      ))}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Loading more articles...</span>
          </div>
        </div>
      )}

      {!hasMore && groups.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No more articles to load</p>
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMoreGroups}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  )
}

