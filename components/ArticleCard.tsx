'use client'

import { useState } from 'react'
import { Article } from '@/lib/types'
import Image from 'next/image'
import { SupplierInfo } from './SupplierInfo'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentExists, setCurrentExists] = useState(article.exists)

  const handleUpdate = async (exists: boolean) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/articles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: article.id,
          exists
        }),
      })

      if (response.ok) {
        setCurrentExists(exists)
      } else {
        console.error('Failed to update article')
      }
    } catch (error) {
      console.error('Error updating article:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
        {article.productImage ? (
          <Image
            src={`/images/${article.productImage.fileName}`}
            alt={article.productName}
            width={300}
            height={300}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center text-gray-400 ${article.productImage ? 'hidden' : ''}`}>
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Article Info */}
      <div className="space-y-2 mb-4">
        <h4 className="font-semibold text-gray-900 line-clamp-2">
          {article.productName}
        </h4>
        
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">Article ID:</span> {article.articleId}</p>
          <p><span className="font-medium">Article No:</span> {article.articleNo}</p>
          <div className="flex items-center gap-2">
            <span className="font-medium">Supplier:</span> 
            <SupplierInfo supplierName={article.supplier.name} size="md" />
          </div>
        </div>

        {article.inputDesignation && (
          <p className="text-sm text-gray-500 italic">
            {article.inputDesignation}
          </p>
        )}

        {/* OEM Numbers */}
        {article.oemNumbers.length > 0 && (
          <div className="text-sm">
            <p className="font-medium text-gray-700 mb-1">OEM Numbers:</p>
            <div className="space-y-1">
              {article.oemNumbers.slice(0, 3).map((oem) => (
                <div key={oem.id} className="bg-gray-50 px-2 py-1 rounded text-xs">
                  <span className="font-medium">{oem.oemBrand}:</span> {oem.oemNumber}
                </div>
              ))}
              {article.oemNumbers.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{article.oemNumbers.length - 3} more...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Image Info */}
        {article.productImage && (
          <div className="text-xs text-gray-500">
            <p>Image: {article.productImage.fileName}</p>
            <p>Size: {formatFileSize(article.productImage.fileSize)}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleUpdate(true)}
          disabled={isUpdating || currentExists === true}
          className={`flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentExists === true
              ? 'bg-green-600 cursor-default'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {isUpdating ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {currentExists === true ? 'Exists' : 'Mark as Existing'}
            </>
          )}
        </button>

        <button
          onClick={() => handleUpdate(false)}
          disabled={isUpdating || currentExists === false}
          className={`flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentExists === false
              ? 'bg-red-600 cursor-default'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          {isUpdating ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {currentExists === false ? 'Not Exists' : 'Mark as Not Existing'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
