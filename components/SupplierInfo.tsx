'use client'

import { SupplierLogo } from './SupplierLogo'

interface SupplierInfoProps {
  supplierName: string
  showLogo?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SupplierInfo({ 
  supplierName, 
  showLogo = true, 
  size = 'md',
  className = '' 
}: SupplierInfoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLogo && (
        <SupplierLogo supplierName={supplierName} size={size} />
      )}
      <span className="text-sm font-medium text-gray-700">
        {supplierName}
      </span>
    </div>
  )
}
