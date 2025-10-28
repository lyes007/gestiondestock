'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { SearchResults } from '@/components/SearchResults'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const handleSearch = (searchQuery: string, searchFilter: string) => {
    setQuery(searchQuery)
    setFilter(searchFilter)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Articles
          </h1>
          <p className="text-gray-600">
            Search across articles by article number, designation, and OEM numbers
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by article number, designation, or OEM number..."
            className="w-full"
          />
        </div>

        {/* Search Results */}
        <SearchResults
          query={query}
          filter={filter}
          hasMore={true}
          isLoading={false}
        />
      </div>
    </div>
  )
}
