import { prisma } from '../lib/prisma'
import gamesData from '../data/games-final.json'
import giftCardsData from '../data/gift-cards-final.json'
import topUpsData from '../data/top-ups-final.json'

interface ImportProduct {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  subcategory: string
  platform: string[]
  region: string
  digital: boolean
  inStock: boolean
  stockCount: number
  images: string[]
  tags: string[]
  rating: number
  reviews: number
  seller: string
  deliveryTime: string
  requirements?: {
    minimum: string
    recommended: string
  }
  features: string[]
  createdAt: string
  updatedAt: string
}

async function migrateProducts() {
  console.log('🚀 Starting product migration to Neon database...')
  
  try {
    // Combine all product data
    const allProducts: ImportProduct[] = [
      ...(gamesData as ImportProduct[]),
      ...(giftCardsData as ImportProduct[]),
      ...(topUpsData as ImportProduct[])
    ]

    console.log(`📊 Found ${allProducts.length} products to migrate`)

    // Clear existing products (if any)
    await prisma.product.deleteMany()
    console.log('🗑️ Cleared existing products')

    // Insert products in batches
    const batchSize = 100
    let processed = 0

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize)
      
      const productsToInsert = batch.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || null,
        discount: product.discount || null,
        category: product.category,
        subcategory: product.subcategory,
        platform: product.platform,
        region: product.region || 'Global',
        digital: product.digital,
        inStock: product.inStock,
        stockCount: product.stockCount,
        images: product.images,
        tags: product.tags,
        rating: product.rating,
        reviewCount: product.reviews || 0,
        seller: product.seller,
        deliveryTime: product.deliveryTime || 'Instant',
        requirements: product.requirements || null,
        features: product.features,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      }))

      await prisma.product.createMany({
        data: productsToInsert,
        skipDuplicates: true
      })

      processed += batch.length
      console.log(`✅ Processed ${processed}/${allProducts.length} products`)
    }

    console.log('🎉 Product migration completed successfully!')
    
    // Get migration statistics
    const stats = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    })

    console.log('\n📈 Migration Statistics:')
    stats.forEach((stat: any) => {
      console.log(`  ${stat.category}: ${stat._count.id} products`)
    })

    const totalProducts = await prisma.product.count()
    console.log(`\n🎯 Total products in database: ${totalProducts}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

async function createSampleUser() {
  console.log('👤 Creating sample user...')
  
  try {
    const user = await prisma.user.upsert({
      where: { email: 'demo@caleb.com' },
      update: {},
      create: {
        email: 'demo@caleb.com',
        name: 'Demo User',
        currency: 'USD',
        language: 'en',
        theme: 'dark',
        emailNotifications: true,
        pushNotifications: true,
        marketingNotifications: false
      }
    })

    console.log('✅ Sample user created:', user.email)
    return user
  } catch (error) {
    console.error('❌ Failed to create sample user:', error)
    throw error
  }
}

async function createSampleCoupons() {
  console.log('🎫 Creating sample coupons...')
  
  try {
    const coupons = await prisma.coupon.createMany({
      data: [
        {
          code: 'WELCOME10',
          type: 'PERCENTAGE',
          value: 10,
          minOrder: 25,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          active: true,
          categories: ['Games', 'Gift Cards', 'Top-ups']
        },
        {
          code: 'FREESHIP',
          type: 'FREE_SHIPPING',
          value: 0,
          minOrder: 50,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          active: true,
          categories: ['Games', 'Gift Cards', 'Top-ups']
        },
        {
          code: 'SAVE5',
          type: 'FIXED_AMOUNT',
          value: 5,
          minOrder: 20,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          active: true,
          categories: ['Games']
        }
      ],
      skipDuplicates: true
    })

    console.log(`✅ Created ${coupons.count} sample coupons`)
  } catch (error) {
    console.error('❌ Failed to create sample coupons:', error)
    throw error
  }
}

async function main() {
  console.log('🎮 CALEB Database Migration Starting...\n')

  try {
    await migrateProducts()
    await createSampleUser()
    await createSampleCoupons()
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('🚀 Your Neon database is ready for production!')
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { main as migrateData }