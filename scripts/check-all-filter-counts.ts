import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function checkAllFilterCounts() {
  console.log('🔍 Checking all filter counts...\n')

  // All articles
  const allCounts = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { exists: null },
    _count: { inputCode: true },
    having: { inputCode: { _count: { gt: 1 } } }
  })

  // RENAULT/NISSAN/DACIA + No OEM
  const combinedCounts = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { 
      exists: null,
      OR: [
        { oemNumbers: { some: { oemBrand: { in: ['RENAULT', 'NISSAN', 'DACIA'] } } } },
        { oemNumbers: { none: {} } }
      ]
    },
    _count: { inputCode: true },
    having: { inputCode: { _count: { gt: 1 } } }
  })

  // RENAULT/NISSAN/DACIA Only
  const renaultOnlyCounts = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { 
      exists: null,
      oemNumbers: { some: { oemBrand: { in: ['RENAULT', 'NISSAN', 'DACIA'] } } }
    },
    _count: { inputCode: true },
    having: { inputCode: { _count: { gt: 1 } } }
  })

  // No OEM Only
  const noOemCounts = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { 
      exists: null,
      oemNumbers: { none: {} }
    },
    _count: { inputCode: true },
    having: { inputCode: { _count: { gt: 1 } } }
  })

  console.log('📊 Filter Counts:')
  console.log(`All Articles: ${allCounts.length} groups`)
  console.log(`RENAULT/NISSAN/DACIA + No OEM: ${combinedCounts.length} groups`)
  console.log(`RENAULT/NISSAN/DACIA Only: ${renaultOnlyCounts.length} groups`)
  console.log(`No OEM Only: ${noOemCounts.length} groups`)

  // Calculate the difference for the combined filter
  const combinedDifference = combinedCounts.length - renaultOnlyCounts.length
  console.log(`\n📈 Combined filter adds ${combinedDifference} No OEM groups to RENAULT/NISSAN/DACIA`)
}

checkAllFilterCounts()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

