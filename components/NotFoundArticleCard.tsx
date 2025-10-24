'use client'

interface NotFoundArticle {
  id: number
  code: string
  designation: string | null
  status: string
  timestamp: Date
  createdAt: Date
  updatedAt: Date
}

interface NotFoundArticleCardProps {
  article: NotFoundArticle
}

export function NotFoundArticleCard({ article }: NotFoundArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="border border-red-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-red-50">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Not Found
        </span>
        <span className="text-xs text-gray-500">
          {formatDate(article.createdAt)}
        </span>
      </div>

      {/* Article Info */}
      <div className="space-y-2">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">
            Code: {article.code}
          </h4>
          {article.designation && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {article.designation}
            </p>
          )}
        </div>

        {/* Status Info */}
        <div className="text-xs text-gray-500">
          <p><span className="font-medium">Status:</span> {article.status}</p>
          <p><span className="font-medium">ID:</span> {article.id}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 mt-3">
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Not Available
          </button>
        </div>
      </div>
    </div>
  )
}

