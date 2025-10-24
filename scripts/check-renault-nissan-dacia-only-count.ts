import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function checkRenaultNissanDaciaOnlyCount() {
  console.log('🔍 Checking RENAULT/NISSAN/DACIA Only groups count...\n')

  // Get inputCodes that have multiple articles with RENAULT/NISSAN/DACIA only
  const inputCodeCounts = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { 
      exists: null,
      oemNumbers: {
        some: {
          oemBrand: {
            in: ['RENAULT', 'NISSAN', 'DACIA']
          }
        }
      }
    },
    _count: {
      inputCode: true
    },
    having: {
      inputCode: {
        _count: {
          gt: 1
        }
      }
    },
    orderBy: { inputCode: 'asc' }
  })

  console.log(`📊 Found ${inputCodeCounts.length} inputCodes with multiple RENAULT/NISSAN/DACIA articles`)
  
  // Get total articles count for this filter
  const totalArticles = await prisma.article.count({
    where: { 
      exists: null,
      oemNumbers: {
        some: {
          oemBrand: {
            in: ['RENAULT', 'NISSAN', 'DACIA']
          }
        }
      }
    }
  })

  console.log(`📋 Total RENAULT/NISSAN/DACIA articles: ${totalArticles}`)
  
  // Show first 10 examples
  console.log('\n📝 First 10 RENAULT/NISSAN/DACIA inputCodes:')
  inputCodeCounts.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. InputCode: ${item.inputCode} (${item._count.inputCode} articles)`)
  })

  console.log('\n📈 Summary:')
  console.log(`RENAULT/NISSAN/DACIA Only Groups: ${inputCodeCounts.length}`)
  console.log(`Total RENAULT/NISSAN/DACIA Articles: ${totalArticles}`)
}

checkRenaultNissanDaciaOnlyCount()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

