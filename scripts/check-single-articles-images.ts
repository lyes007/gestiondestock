import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function checkSingleArticlesImages() {
  console.log('🔍 Checking images for single articles (one article per inputCode)...\n')

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
  
  // Get the actual articles with their images
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
  
  // Count articles with and without images
  const articlesWithImages = singleArticles.filter(article => article.productImage)
  const articlesWithoutImages = singleArticles.filter(article => !article.productImage)
  
  console.log('\n📸 Image Statistics for Single Articles:')
  console.log(`Articles WITH images: ${articlesWithImages.length} (${((articlesWithImages.length / singleArticles.length) * 100).toFixed(2)}%)`)
  console.log(`Articles WITHOUT images: ${articlesWithoutImages.length} (${((articlesWithoutImages.length / singleArticles.length) * 100).toFixed(2)}%)`)
  
  // Show examples of articles with images
  console.log('\n📝 First 10 single articles WITH images:')
  articlesWithImages.slice(0, 10).forEach((article, index) => {
    console.log(`${index + 1}. InputCode: ${article.inputCode}`)
    console.log(`   Product: ${article.productName}`)
    console.log(`   Supplier: ${article.supplier.name}`)
    console.log(`   Image: ${article.productImage?.fileName}`)
    console.log(`   Image Size: ${article.productImage?.fileSize ? (article.productImage.fileSize / 1024).toFixed(2) + ' KB' : 'Unknown'}`)
    console.log(`   Image Type: ${article.productImage?.mimeType || 'Unknown'}`)
    console.log('')
  })

  // Show examples of articles without images
  console.log('\n📝 First 10 single articles WITHOUT images:')
  articlesWithoutImages.slice(0, 10).forEach((article, index) => {
    console.log(`${index + 1}. InputCode: ${article.inputCode}`)
    console.log(`   Product: ${article.productName}`)
    console.log(`   Supplier: ${article.supplier.name}`)
    console.log(`   OEM Numbers: ${article.oemNumbers.length}`)
    console.log('')
  })

  // Check image file sizes for articles that have images
  const imageSizes = articlesWithImages
    .filter(a => a.productImage?.fileSize)
    .map(a => a.productImage!.fileSize!)
    .sort((a, b) => a - b)

  if (imageSizes.length > 0) {
    const avgSize = imageSizes.reduce((sum, size) => sum + size, 0) / imageSizes.length
    const minSize = imageSizes[0]
    const maxSize = imageSizes[imageSizes.length - 1]
    const medianSize = imageSizes[Math.floor(imageSizes.length / 2)]

    console.log('\n📊 Image Size Statistics:')
    console.log(`Average size: ${(avgSize / 1024).toFixed(2)} KB`)
    console.log(`Minimum size: ${(minSize / 1024).toFixed(2)} KB`)
    console.log(`Maximum size: ${(maxSize / 1024).toFixed(2)} KB`)
    console.log(`Median size: ${(medianSize / 1024).toFixed(2)} KB`)
  }

  // Check image types
  const imageTypes = articlesWithImages
    .filter(a => a.productImage?.mimeType)
    .reduce((acc, article) => {
      const type = article.productImage!.mimeType!
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  if (Object.keys(imageTypes).length > 0) {
    console.log('\n📊 Image Types:')
    Object.entries(imageTypes).forEach(([type, count]) => {
      console.log(`${type}: ${count} images`)
    })
  }
}

checkSingleArticlesImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

