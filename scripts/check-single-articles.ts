import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function checkSingleArticles() {
  console.log('🔍 Checking for articles with only one article per inputCode...\n')

  // Get inputCodes that have exactly one article
  const singleArticleGroups = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { exists: null },
    _count: {
      inputCode: true
    },
    having: {
      inputCode: {
        _count: {
          equals: 1
        }
      }
    },
    orderBy: { inputCode: 'asc' }
  })

  console.log(`📊 Found ${singleArticleGroups.length} inputCodes with exactly ONE article each`)
  
  // Get the actual articles
  const singleArticles = await prisma.article.findMany({
    where: {
      exists: null,
      inputCode: {
        in: singleArticleGroups.map(g => g.inputCode)
      }
    },
    include: {
      supplier: true,
      oemNumbers: true,
      productImage: true
    },
    orderBy: { inputCode: 'asc' }
  })

  console.log(`📋 Total single articles: ${singleArticles.length}`)
  
  // Show first 10 examples
  console.log('\n📝 First 10 single articles:')
  singleArticles.slice(0, 10).forEach((article, index) => {
    console.log(`${index + 1}. InputCode: ${article.inputCode}`)
    console.log(`   Product: ${article.productName}`)
    console.log(`   Supplier: ${article.supplier.name}`)
    console.log(`   OEM Numbers: ${article.oemNumbers.length}`)
    console.log(`   Has Image: ${article.productImage ? 'Yes' : 'No'}`)
    console.log('')
  })

  // Get inputCodes with multiple articles for comparison
  const multipleArticleGroups = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { exists: null },
    _count: {
      inputCode: true
    },
    having: {
      inputCode: {
        _count: {
          gt: 1
        }
      }
    }
  })

  console.log(`📊 Found ${multipleArticleGroups.length} inputCodes with MULTIPLE articles each`)
  
  const totalArticles = await prisma.article.count({ where: { exists: null } })
  const totalInputCodes = await prisma.article.groupBy({
    by: ['inputCode'],
    where: { exists: null }
  })

  console.log('\n📈 Summary:')
  console.log(`Total Articles: ${totalArticles}`)
  console.log(`Total InputCodes: ${totalInputCodes.length}`)
  console.log(`Single Article InputCodes: ${singleArticleGroups.length}`)
  console.log(`Multiple Article InputCodes: ${multipleArticleGroups.length}`)
  console.log(`Single Articles: ${singleArticles.length}`)
  console.log(`Multiple Articles: ${totalArticles - singleArticles.length}`)
}

checkSingleArticles()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
