'use client'

import { useState } from 'react'
import { ArticleCard } from './ArticleCard'
import { Article } from '@/lib/types'
import { SupplierInfo } from './SupplierInfo'
import { SupplierShowcase } from './SupplierShowcase'

interface ArticleGroupProps {
  inputCode: string
  articles: Article[]
}

export function ArticleGroup({ inputCode, articles }: ArticleGroupProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleBulkUpdate = async (exists: boolean) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/articles/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputCode,
          exists
        }),
      })

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        console.error('Failed to update articles')
      }
    } catch (error) {
      console.error('Error updating articles:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Input Code: {inputCode}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">{articles.length}</span> article{articles.length !== 1 ? 's' : ''} to compare
              </p>
              {/* Show unique suppliers in this group */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Suppliers:</span>
                <div className="flex items-center gap-1">
                  {Array.from(new Set(articles.map(a => a.supplier.name))).slice(0, 3).map((supplierName, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <SupplierInfo supplierName={supplierName} size="md" />
                      {index < Math.min(3, Array.from(new Set(articles.map(a => a.supplier.name))).length) - 1 && (
                        <span className="text-xs text-gray-400">,</span>
                      )}
                    </div>
                  ))}
                  {Array.from(new Set(articles.map(a => a.supplier.name))).length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{Array.from(new Set(articles.map(a => a.supplier.name))).length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleBulkUpdate(true)}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Mark All as Existing
            </button>
            <button
              onClick={() => handleBulkUpdate(false)}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              Mark All as Not Existing
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Supplier Showcase */}
        <SupplierShowcase 
          suppliers={articles.map(a => a.supplier.name)}
          title={`Suppliers for Input Code: ${inputCode}`}
          maxDisplay={8}
        />
        
        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  )
}
