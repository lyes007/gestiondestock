import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function resetAllArticlesToNull() {
  console.log('🔄 Resetting all articles to exists = null...\n')

  try {
    // Get current counts before reset
    const beforeStats = await prisma.$transaction([
      prisma.article.count(),
      prisma.article.count({ where: { exists: true } }),
      prisma.article.count({ where: { exists: false } }),
      prisma.article.count({ where: { exists: null } })
    ])

    const [total, existing, notExisting, unmarked] = beforeStats

    console.log('📊 Before Reset:')
    console.log(`   Total Articles: ${total.toLocaleString()}`)
    console.log(`   Marked as Existing: ${existing.toLocaleString()}`)
    console.log(`   Marked as Not Existing: ${notExisting.toLocaleString()}`)
    console.log(`   Unmarked: ${unmarked.toLocaleString()}`)

    // Reset all articles to exists = null
    const updateResult = await prisma.article.updateMany({
      data: { exists: null }
    })

    console.log(`\n✅ Updated ${updateResult.count.toLocaleString()} articles`)

    // Get counts after reset
    const afterStats = await prisma.$transaction([
      prisma.article.count(),
      prisma.article.count({ where: { exists: true } }),
      prisma.article.count({ where: { exists: false } }),
      prisma.article.count({ where: { exists: null } })
    ])

    const [totalAfter, existingAfter, notExistingAfter, unmarkedAfter] = afterStats

    console.log('\n📊 After Reset:')
    console.log(`   Total Articles: ${totalAfter.toLocaleString()}`)
    console.log(`   Marked as Existing: ${existingAfter.toLocaleString()}`)
    console.log(`   Marked as Not Existing: ${notExistingAfter.toLocaleString()}`)
    console.log(`   Unmarked: ${unmarkedAfter.toLocaleString()}`)

    console.log('\n🎉 All articles have been reset to exists = null!')
    console.log('   All articles are now unmarked and ready for review.')

  } catch (error) {
    console.error('❌ Error resetting articles:', error)
    throw error
  }
}

resetAllArticlesToNull()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
