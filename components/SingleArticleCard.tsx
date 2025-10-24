'use client'

import { useState } from 'react'
import { Article } from '@/lib/types'
import Image from 'next/image'
import { SupplierInfo } from './SupplierInfo'

interface SingleArticleCardProps {
  article: Article
}

export function SingleArticleCard({ article }: SingleArticleCardProps) {
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
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-square mb-3 bg-white rounded-lg overflow-hidden">
        {article.productImage ? (
          <Image
            src={`/images/${article.productImage.fileName}`}
            alt={article.productName}
            width={200}
            height={200}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center text-gray-400 ${article.productImage ? 'hidden' : ''}`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Article Info */}
      <div className="space-y-1.5 mb-3">
        <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">
          {article.productName}
        </h4>
        
        <div className="text-xs text-gray-600 space-y-0.5">
          <p><span className="font-medium">ID:</span> {article.articleId}</p>
          <p><span className="font-medium">No:</span> {article.articleNo}</p>
          <div className="flex items-center gap-1">
            <span className="font-medium">Supplier:</span> 
            <SupplierInfo supplierName={article.supplier.name} size="sm" />
          </div>
        </div>

        {article.inputDesignation && (
          <p className="text-xs text-gray-500 italic">
            {article.inputDesignation}
          </p>
        )}

        {/* OEM Numbers */}
        {article.oemNumbers.length > 0 && (
          <div className="text-xs">
            <p className="font-medium text-black mb-1">OEM:</p>
            <div className="space-y-0.5">
              {article.oemNumbers.map((oem) => (
                <div key={oem.id} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs border">
                  <span className="font-medium text-gray-900">{oem.oemBrand}:</span> <span className="text-gray-800">{oem.oemNumber}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-1">
        <button
          onClick={() => handleUpdate(true)}
          disabled={isUpdating || currentExists === true}
          className={`flex-1 inline-flex items-center justify-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-md text-white focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentExists === true
              ? 'bg-green-600 cursor-default'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {isUpdating ? (
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {currentExists === true ? 'Exists' : 'Exists'}
            </>
          )}
        </button>

        <button
          onClick={() => handleUpdate(false)}
          disabled={isUpdating || currentExists === false}
          className={`flex-1 inline-flex items-center justify-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-md text-white focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentExists === false
              ? 'bg-red-600 cursor-default'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          {isUpdating ? (
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {currentExists === false ? 'Not' : 'Not'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

