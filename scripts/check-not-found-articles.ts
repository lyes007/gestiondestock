import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function checkNotFoundArticles() {
  console.log('🔍 Checking for articles NOT found in TecDoc API...\n')

  // Get all not found articles
  const notFoundArticles = await prisma.notFoundArticle.findMany({
    orderBy: { createdAt: 'desc' }
  })

  console.log(`📊 Total articles NOT found in TecDoc: ${notFoundArticles.length}`)
  
  // Show first 10 examples
  console.log('\n📝 First 10 NOT FOUND articles:')
  notFoundArticles.slice(0, 10).forEach((article, index) => {
    console.log(`${index + 1}. Code: ${article.code}`)
    console.log(`   Designation: ${article.designation}`)
    console.log(`   Status: ${article.status}`)
    console.log(`   Created: ${article.createdAt.toISOString()}`)
    console.log('')
  })

  // Get statistics
  const totalFoundArticles = await prisma.article.count()
  const totalNotFoundArticles = notFoundArticles.length
  const totalProcessed = totalFoundArticles + totalNotFoundArticles
  
  console.log('\n📈 Summary:')
  console.log(`Total Articles Found in TecDoc: ${totalFoundArticles}`)
  console.log(`Total Articles NOT Found in TecDoc: ${totalNotFoundArticles}`)
  console.log(`Total Articles Processed: ${totalProcessed}`)
  console.log(`Success Rate: ${((totalFoundArticles / totalProcessed) * 100).toFixed(2)}%`)
  console.log(`Not Found Rate: ${((totalNotFoundArticles / totalProcessed) * 100).toFixed(2)}%`)

  // Check if there are any patterns in not found articles
  const uniqueCodes = new Set(notFoundArticles.map(a => a.code))
  console.log(`\n🔍 Unique codes not found: ${uniqueCodes.size}`)
  
  // Show some examples of not found designations
  const designations = notFoundArticles
    .filter(a => a.designation)
    .slice(0, 5)
    .map(a => a.designation)
  
  if (designations.length > 0) {
    console.log('\n📝 Examples of NOT FOUND designations:')
    designations.forEach((designation, index) => {
      console.log(`${index + 1}. ${designation}`)
    })
  }
}

checkNotFoundArticles()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

