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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Articles
        </h1>
        <p className="text-gray-600">
          Search across articles by designation, OEM number, article number, product name, supplier, or manufacturer
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by designation, OEM number, article number, product name, supplier..."
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
  )
}
