'use client'

import Image from 'next/image'
import { useState } from 'react'

interface SupplierLogoProps {
  supplierName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SupplierLogo({ supplierName, size = 'sm', className = '' }: SupplierLogoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Function to find the best matching supplier image
  const findSupplierImage = (name: string): string | null => {
    // Normalize the supplier name for matching
    const normalizedName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores

    // List of available supplier images (from the folder you provided)
    const supplierImages = [
      'FARCOM.jpg', 'SARDES_FILTRE.jpg', 'FRAP.jpg', 'UCEL.jpg', 'GIF.jpg', 'ISAM.jpg', 'BGF.jpg', 'MTA.jpg',
      'RUVILLE.jpg', 'ZEN.jpg', 'KLAS.jpg', 'WUNDER.jpg', 'FACET.jpg', 'AUTOGAMMA.jpg', 'CHAMPION.jpg',
      'sonax.jpg', 'EXO.jpg', 'SHELL.jpg', 'OCAP_GROUPE.jpg', 'drive.jpg', 'VIKA.jpg', 'VALEO.jpg',
      'SASIC.jpg', 'TRW.jpg', 'karhabtktn_logo.jpg', 'MFILTRE.jpg', 'VICTOR_REINZ.jpg', 'SELENIA.jpg',
      'GM.jpg', 'image_886x1219_182.jpg', 'NGK.jpg', 'VAGMAX.jpg', 'CASTROL.jpg', 'NE.jpg', 'TRICLO.jpg',
      'MANDO.jpg', 'MOTUL.jpg', 'KAVO.jpg', 'VARTA.jpg', 'FTE.jpg', 'FEBI_BILSTEIN.jpg', '3RG.jpg',
      'BOSCH.jpg', 'MISFAT.jpg', 'ELF.jpg', 'filtron.jpg', 'TOTAL.jpg', 'LPR.jpg', 'TOPRAN.jpg',
      'VERNET.jpg', 'LUCAS.jpg', 'LIQUI_MOLY.jpg', 'GATES.jpg', 'YACCO.jpg', 'VIF.jpg', 'UFI.jpg',
      'VM.jpg', 'TYC.jpg', 'TEKNOROT.jpg', 'SIAMM.jpg', 'SKF.jpg', 'TALOSA.jpg', 'STC.jpg', 'SVAC.jpg',
      'SNR.jpg', 'SIDAT.jpg', 'RTS.jpg', 'RODRUNNER.jpg', 'SACHS.jpg', 'RIDEX.jpg', 'RECORD FRANCE.jpg',
      'PSA.jpg', 'PLEKSAN.jpg', 'PRO_MAX.jpg', 'PRASCO.jpg', 'PIERBURG.jpg', 'OPTIMAL.jpg', 'PHILIPS.jpg',
      'OCEANA.jpg', 'OSSCA.jpg', 'NSK.jpg', 'NPR.jpg', 'NRF.jpg', 'MS_GERMANY.jpg', 'NARVA.jpg',
      'MONROE.jpg', 'MOOG.jpg', 'MULTISPARK.jpg', 'MOTRIO.jpg', 'METELLI.jpg', 'MECARM.jpg',
      'METALCAUCHO.jpg', 'MECAFILTER.jpg', 'MEAT & DORIA.jpg', 'Maysan_mando.jpg', 'MCB_BEARINGS.jpg',
      'MCAR.jpg', 'MARS.jpg', 'MASTER.jpg', 'MARILIA.jpg'
    ]

    // Try exact match first
    for (const image of supplierImages) {
      const imageName = image.toLowerCase().replace('.jpg', '').replace(/[^a-z0-9]/g, '')
      if (imageName === normalizedName) {
        return image
      }
    }

    // Try partial match
    for (const image of supplierImages) {
      const imageName = image.toLowerCase().replace('.jpg', '').replace(/[^a-z0-9]/g, '')
      if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
        return image
      }
    }

    // Try some common variations
    const variations = [
      { search: 'febi', match: 'FEBI_BILSTEIN.jpg' },
      { search: 'bilstein', match: 'FEBI_BILSTEIN.jpg' },
      { search: 'record', match: 'RECORD FRANCE.jpg' },
      { search: 'france', match: 'RECORD FRANCE.jpg' },
      { search: 'meat', match: 'MEAT & DORIA.jpg' },
      { search: 'doria', match: 'MEAT & DORIA.jpg' },
      { search: 'liqui', match: 'LIQUI_MOLY.jpg' },
      { search: 'moly', match: 'LIQUI_MOLY.jpg' },
      { search: 'victor', match: 'VICTOR_REINZ.jpg' },
      { search: 'reinz', match: 'VICTOR_REINZ.jpg' },
      { search: 'maysan', match: 'Maysan_mando.jpg' },
      { search: 'mando', match: 'Maysan_mando.jpg' },
      { search: 'mcb', match: 'MCB_BEARINGS.jpg' },
      { search: 'bearings', match: 'MCB_BEARINGS.jpg' },
      { search: 'mcar', match: 'MCAR.jpg' },
      { search: 'master', match: 'MASTER.jpg' },
      { search: 'marilia', match: 'MARILIA.jpg' },
      { search: 'mars', match: 'MARS.jpg' },
      { search: 'mecafilter', match: 'MECAFILTER.jpg' },
      { search: 'metalcaucho', match: 'METALCAUCHO.jpg' },
      { search: 'mecarm', match: 'MECARM.jpg' },
      { search: 'metelli', match: 'METELLI.jpg' },
      { search: 'motrio', match: 'MOTRIO.jpg' },
      { search: 'multispark', match: 'MULTISPARK.jpg' },
      { search: 'moog', match: 'MOOG.jpg' },
      { search: 'monroe', match: 'MONROE.jpg' },
      { search: 'narva', match: 'NARVA.jpg' },
      { search: 'ms_germany', match: 'MS_GERMANY.jpg' },
      { search: 'germany', match: 'MS_GERMANY.jpg' },
      { search: 'nrf', match: 'NRF.jpg' },
      { search: 'npr', match: 'NPR.jpg' },
      { search: 'nsk', match: 'NSK.jpg' },
      { search: 'ossca', match: 'OSSCA.jpg' },
      { search: 'oceana', match: 'OCEANA.jpg' },
      { search: 'philips', match: 'PHILIPS.jpg' },
      { search: 'optimal', match: 'OPTIMAL.jpg' },
      { search: 'pierburg', match: 'PIERBURG.jpg' },
      { search: 'prasco', match: 'PRASCO.jpg' },
      { search: 'pro_max', match: 'PRO_MAX.jpg' },
      { search: 'pleksan', match: 'PLEKSAN.jpg' },
      { search: 'psa', match: 'PSA.jpg' },
      { search: 'ridex', match: 'RIDEX.jpg' },
      { search: 'sachs', match: 'SACHS.jpg' },
      { search: 'rodrunner', match: 'RODRUNNER.jpg' },
      { search: 'rts', match: 'RTS.jpg' },
      { search: 'sidat', match: 'SIDAT.jpg' },
      { search: 'snr', match: 'SNR.jpg' },
      { search: 'svac', match: 'SVAC.jpg' },
      { search: 'stc', match: 'STC.jpg' },
      { search: 'talosa', match: 'TALOSA.jpg' },
      { search: 'skf', match: 'SKF.jpg' },
      { search: 'siamm', match: 'SIAMM.jpg' },
      { search: 'teknorot', match: 'TEKNOROT.jpg' },
      { search: 'tyc', match: 'TYC.jpg' },
      { search: 'vm', match: 'VM.jpg' },
      { search: 'ufi', match: 'UFI.jpg' },
      { search: 'vif', match: 'VIF.jpg' },
      { search: 'yacco', match: 'YACCO.jpg' },
      { search: 'gates', match: 'GATES.jpg' },
      { search: 'lucas', match: 'LUCAS.jpg' },
      { search: 'vernet', match: 'VERNET.jpg' },
      { search: 'topran', match: 'TOPRAN.jpg' },
      { search: 'lpr', match: 'LPR.jpg' },
      { search: 'total', match: 'TOTAL.jpg' },
      { search: 'filtron', match: 'filtron.jpg' },
      { search: 'elf', match: 'ELF.jpg' },
      { search: 'misfat', match: 'MISFAT.jpg' },
      { search: 'bosch', match: 'BOSCH.jpg' },
      { search: '3rg', match: '3RG.jpg' },
      { search: 'febi_bilstein', match: 'FEBI_BILSTEIN.jpg' },
      { search: 'fte', match: 'FTE.jpg' },
      { search: 'varta', match: 'VARTA.jpg' },
      { search: 'kavo', match: 'KAVO.jpg' },
      { search: 'motul', match: 'MOTUL.jpg' },
      { search: 'mando', match: 'MANDO.jpg' },
      { search: 'triclo', match: 'TRICLO.jpg' },
      { search: 'ne', match: 'NE.jpg' },
      { search: 'castrol', match: 'CASTROL.jpg' },
      { search: 'vagmax', match: 'VAGMAX.jpg' },
      { search: 'ngk', match: 'NGK.jpg' },
      { search: 'gm', match: 'GM.jpg' },
      { search: 'selenia', match: 'SELENIA.jpg' },
      { search: 'victor_reinz', match: 'VICTOR_REINZ.jpg' },
      { search: 'mfiltre', match: 'MFILTRE.jpg' },
      { search: 'trw', match: 'TRW.jpg' },
      { search: 'sasic', match: 'SASIC.jpg' },
      { search: 'valeo', match: 'VALEO.jpg' },
      { search: 'vika', match: 'VIKA.jpg' },
      { search: 'drive', match: 'drive.jpg' },
      { search: 'ocap_groupe', match: 'OCAP_GROUPE.jpg' },
      { search: 'ocap', match: 'OCAP_GROUPE.jpg' },
      { search: 'groupe', match: 'OCAP_GROUPE.jpg' },
      { search: 'shell', match: 'SHELL.jpg' },
      { search: 'exo', match: 'EXO.jpg' },
      { search: 'sonax', match: 'sonax.jpg' },
      { search: 'champion', match: 'CHAMPION.jpg' },
      { search: 'autogamma', match: 'AUTOGAMMA.jpg' },
      { search: 'facet', match: 'FACET.jpg' },
      { search: 'wunder', match: 'WUNDER.jpg' },
      { search: 'klas', match: 'KLAS.jpg' },
      { search: 'zen', match: 'ZEN.jpg' },
      { search: 'ruville', match: 'RUVILLE.jpg' },
      { search: 'mta', match: 'MTA.jpg' },
      { search: 'bgf', match: 'BGF.jpg' },
      { search: 'isam', match: 'ISAM.jpg' },
      { search: 'gif', match: 'GIF.jpg' },
      { search: 'ucel', match: 'UCEL.jpg' },
      { search: 'frap', match: 'FRAP.jpg' },
      { search: 'sardes_filtre', match: 'SARDES_FILTRE.jpg' },
      { search: 'sardes', match: 'SARDES_FILTRE.jpg' },
      { search: 'filtre', match: 'SARDES_FILTRE.jpg' },
      { search: 'farcom', match: 'FARCOM.jpg' }
    ]

    for (const variation of variations) {
      if (normalizedName.includes(variation.search)) {
        return variation.match
      }
    }

    return null
  }

  const imageFileName = findSupplierImage(supplierName)

  if (!imageFileName || imageError) {
    return (
      <div className={`bg-gray-100 rounded flex items-center justify-center ${getSizeClasses(size)} ${className}`}>
        <svg className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`relative ${getSizeClasses(size)} ${className}`}>
      <Image
        src={`/images/suppliers/${imageFileName}`}
        alt={`${supplierName} logo`}
        fill
        className="object-contain rounded"
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        sizes="(max-width: 768px) 32px, 48px"
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded animate-pulse flex items-center justify-center">
          <svg className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  )
}

function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-8'
    case 'md':
      return 'w-12 h-12'
    case 'lg':
      return 'w-16 h-16'
    default:
      return 'w-8 h-8'
  }
}
