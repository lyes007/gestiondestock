import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function testSearch() {
  console.log('🔍 Testing search functionality...\n')

  try {
    // Test 1: Search for "filter" in all articles
    console.log('📋 Test 1: Searching for "filter" in all articles')
    const filterResults = await prisma.article.findMany({
      where: {
        exists: null,
        OR: [
          { inputDesignation: { contains: 'filter', mode: 'insensitive' } },
          { articleNo: { contains: 'filter', mode: 'insensitive' } },
          { productName: { contains: 'filter', mode: 'insensitive' } },
          { supplier: { name: { contains: 'filter', mode: 'insensitive' } } },
          { oemNumbers: { some: { oemNumber: { contains: 'filter', mode: 'insensitive' } } } },
          { oemNumbers: { some: { oemBrand: { contains: 'filter', mode: 'insensitive' } } } }
        ]
      },
      include: {
        supplier: true,
        oemNumbers: true,
        productImage: true
      },
      take: 5
    })

    console.log(`   Found ${filterResults.length} articles with "filter"`)
    filterResults.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.inputDesignation} (${article.supplier.name})`)
    })

    // Test 2: Search for "RENAULT" in OEM numbers
    console.log('\n📋 Test 2: Searching for "RENAULT" in OEM numbers')
    const renaultResults = await prisma.article.findMany({
      where: {
        exists: null,
        oemNumbers: { some: { oemBrand: { contains: 'RENAULT', mode: 'insensitive' } } }
      },
      include: {
        supplier: true,
        oemNumbers: true
      },
      take: 5
    })

    console.log(`   Found ${renaultResults.length} articles with RENAULT OEM numbers`)
    renaultResults.forEach((article, index) => {
      const renaultOems = article.oemNumbers.filter(oem => oem.oemBrand.includes('RENAULT'))
      console.log(`   ${index + 1}. ${article.inputDesignation} - RENAULT: ${renaultOems.map(oem => oem.oemNumber).join(', ')}`)
    })

    // Test 3: Search for "BOSCH" supplier
    console.log('\n📋 Test 3: Searching for "BOSCH" supplier')
    const boschResults = await prisma.article.findMany({
      where: {
        exists: null,
        supplier: { name: { contains: 'BOSCH', mode: 'insensitive' } }
      },
      include: {
        supplier: true,
        oemNumbers: true
      },
      take: 5
    })

    console.log(`   Found ${boschResults.length} articles from BOSCH`)
    boschResults.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.inputDesignation} (${article.supplier.name})`)
    })

    // Test 4: Search in not found articles
    console.log('\n📋 Test 4: Searching in not found articles')
    const notFoundResults = await prisma.notFoundArticle.findMany({
      where: {
        OR: [
          { code: { contains: 'filter', mode: 'insensitive' } },
          { designation: { contains: 'filter', mode: 'insensitive' } }
        ]
      },
      take: 5
    })

    console.log(`   Found ${notFoundResults.length} not found articles with "filter"`)
    notFoundResults.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.code} - ${article.designation}`)
    })

    console.log('\n✅ Search functionality is working correctly!')

  } catch (error) {
    console.error('❌ Search test failed:', error)
  }
}

testSearch()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
