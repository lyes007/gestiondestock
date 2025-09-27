'use client'

import { SupplierLogo } from './SupplierLogo'

interface SupplierShowcaseProps {
  suppliers: string[]
  title?: string
  maxDisplay?: number
}

export function SupplierShowcase({ 
  suppliers, 
  title = "Suppliers in this group",
  maxDisplay = 6 
}: SupplierShowcaseProps) {
  const uniqueSuppliers = Array.from(new Set(suppliers))
  const displaySuppliers = uniqueSuppliers.slice(0, maxDisplay)
  const remainingCount = uniqueSuppliers.length - maxDisplay

  if (uniqueSuppliers.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-3">
        {displaySuppliers.map((supplierName, index) => (
          <div key={index} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border">
            <SupplierLogo supplierName={supplierName} size="md" />
            <span className="text-sm text-gray-700 font-medium">{supplierName}</span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-dashed border-gray-300">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-sm text-gray-500 font-bold">+{remainingCount}</span>
            </div>
            <span className="text-sm text-gray-500">more suppliers</span>
          </div>
        )}
      </div>
    </div>
  )
}
