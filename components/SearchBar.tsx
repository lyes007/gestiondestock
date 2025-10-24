'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X, Filter } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string, filter: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "Search articles...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isOpen, setIsOpen] = useState(false)

  // Debounce search
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (searchQuery: string, searchFilter: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          onSearch(searchQuery, searchFilter)
        }, 300)
      }
    })(),
    [onSearch]
  )

  useEffect(() => {
    debouncedSearch(query, filter)
  }, [query, filter, debouncedSearch])

  const handleClear = () => {
    setQuery('')
    onSearch('', filter)
  }

  const filterOptions = [
    { value: 'all', label: 'All Articles', count: '1,064' },
    { value: 'single', label: 'Single Articles', count: '862' },
    { value: 'not-found', label: 'Not Found', count: '1,437' },
    { value: 'renault-nissan-dacia', label: 'RENAULT/NISSAN/DACIA + No OEM', count: '744' },
    { value: 'renault-nissan-dacia-only', label: 'RENAULT/NISSAN/DACIA Only', count: '366' },
    { value: 'no-oem', label: 'No OEM Numbers', count: '412' }
  ]

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">
              {filterOptions.find(opt => opt.value === filter)?.label}
            </span>
            <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                  Search In
                </div>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filter === option.value
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500">({option.count})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Info */}
      {query && (
        <div className="mt-2 text-sm text-gray-600">
          Searching for "<span className="font-medium">{query}</span>" in {filterOptions.find(opt => opt.value === filter)?.label}
        </div>
      )}
    </div>
  )
}
