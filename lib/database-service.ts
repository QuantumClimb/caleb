import { prisma } from './prisma'
import { Prisma } from '@prisma/client'
import Fuse from 'fuse.js'
import { Product } from '../types'

export interface AdvancedFilters {
  // Search
  query?: string
  
  // Categories
  categories?: string[]
  subcategories?: string[]
  
  // Price
  priceRange?: {
    min: number
    max: number
  }
  
  // Platforms
  platforms?: string[]
  
  // Other filters
  regions?: string[]
  inStock?: boolean
  hasDiscount?: boolean
  digital?: boolean
  
  // Rating
  minRating?: number
  
  // Tags
  tags?: string[]
  
  // Sellers
  sellers?: string[]
  
  // Date ranges
  dateRange?: {
    from: string
    to: string
  }
}

export interface SortOptions {
  field: 'createdAt' | 'price' | 'rating' | 'title' | 'discount'
  direction: 'asc' | 'desc'
}

export interface FilterStats {
  totalProducts: number
  priceRange: { min: number; max: number }
  categories: Array<{ name: string; count: number }>
  subcategories: Array<{ name: string; count: number }>
  platforms: Array<{ name: string; count: number }>
  regions: Array<{ name: string; count: number }>
  tags: Array<{ name: string; count: number }>
  sellers: Array<{ name: string; count: number }>
  ratingDistribution: Array<{ rating: number; count: number }>
}

export interface SearchResult {
  products: Product[]
  total: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: FilterStats
}

export class DatabaseService {
  /**
   * Get all products with optional filtering and sorting
   */
  static async getAllProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return products.map(this.transformProduct)
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id }
    })
    
    return product ? this.transformProduct(product) : null
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' }
    })
    
    return products.map(this.transformProduct)
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        rating: { gte: 4.0 },
        inStock: true
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: limit
    })
    
    return products.map(this.transformProduct)
  }

  /**
   * Get products with deals/discounts
   */
  static async getDeals(limit: number = 6): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        discount: { gt: 0 },
        inStock: true
      },
      orderBy: { discount: 'desc' },
      take: limit
    })
    
    return products.map(this.transformProduct)
  }

  /**
   * Advanced search with filters, sorting, and pagination
   */
  static async searchProductsAdvanced(
    filters: AdvancedFilters,
    sort: SortOptions,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResult> {
    // Build where clause
    const where: Prisma.ProductWhereInput = {}

    // Category filters
    if (filters.categories?.length) {
      where.category = { in: filters.categories }
    }

    if (filters.subcategories?.length) {
      where.subcategory = { in: filters.subcategories }
    }

    // Price range
    if (filters.priceRange) {
      where.price = {
        gte: filters.priceRange.min,
        lte: filters.priceRange.max
      }
    }

    // Platform filter
    if (filters.platforms?.length) {
      where.platform = {
        hasSome: filters.platforms
      }
    }

    // Other filters
    if (filters.regions?.length) {
      where.region = { in: filters.regions }
    }

    if (filters.inStock !== undefined) {
      where.inStock = filters.inStock
    }

    if (filters.hasDiscount) {
      where.discount = { gt: 0 }
    }

    if (filters.digital !== undefined) {
      where.digital = filters.digital
    }

    if (filters.minRating) {
      where.rating = { gte: filters.minRating }
    }

    if (filters.tags?.length) {
      where.tags = {
        hasSome: filters.tags
      }
    }

    if (filters.sellers?.length) {
      where.seller = { in: filters.sellers }
    }

    // Date range
    if (filters.dateRange) {
      where.createdAt = {
        gte: new Date(filters.dateRange.from),
        lte: new Date(filters.dateRange.to)
      }
    }

    // Text search
    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { tags: { hasSome: [filters.query] } },
        { seller: { contains: filters.query, mode: 'insensitive' } }
      ]
    }

    // Build orderBy
    const orderBy: Prisma.ProductOrderByWithRelationInput = {}
    
    switch (sort.field) {
      case 'price':
        orderBy.price = sort.direction
        break
      case 'rating':
        orderBy.rating = sort.direction
        break
      case 'title':
        orderBy.title = sort.direction
        break
      case 'discount':
        orderBy.discount = sort.direction
        break
      default:
        orderBy.createdAt = sort.direction
    }

    // Execute queries
    const [products, total, stats] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where }),
      this.getFilterStats(where)
    ])

    return {
      products: products.map(this.transformProduct),
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    }
  }

  /**
   * Get filter statistics for the current query
   */
  private static async getFilterStats(where: Prisma.ProductWhereInput): Promise<FilterStats> {
    const [
      totalProducts,
      priceStats,
      categoryStats,
      subcategoryStats,
      platformStats,
      regionStats,
      sellerStats,
      ratingStats
    ] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.aggregate({
        where,
        _min: { price: true },
        _max: { price: true }
      }),
      prisma.product.groupBy({
        where,
        by: ['category'],
        _count: { id: true }
      }),
      prisma.product.groupBy({
        where,
        by: ['subcategory'],
        _count: { id: true }
      }),
      // Note: PostgreSQL doesn't support groupBy on array fields directly
      // We'll handle platforms, tags differently
      prisma.$queryRaw`
        SELECT UNNEST(platform) as platform, COUNT(*) as count
        FROM products 
        GROUP BY UNNEST(platform)
      ` as Promise<Array<{ platform: string; count: bigint }>>,
      prisma.product.groupBy({
        where,
        by: ['region'],
        _count: { id: true }
      }),
      prisma.product.groupBy({
        where,
        by: ['seller'],
        _count: { id: true }
      }),
      prisma.product.groupBy({
        where,
        by: ['rating'],
        _count: { id: true }
      })
    ])

    return {
      totalProducts,
      priceRange: {
        min: priceStats._min.price || 0,
        max: priceStats._max.price || 0
      },
      categories: categoryStats.map(item => ({
        name: item.category,
        count: item._count.id
      })),
      subcategories: subcategoryStats.map(item => ({
        name: item.subcategory,
        count: item._count.id
      })),
      platforms: platformStats.map(item => ({
        name: item.platform,
        count: Number(item.count)
      })),
      regions: regionStats.map(item => ({
        name: item.region,
        count: item._count.id
      })),
      tags: [], // Will implement separately
      sellers: sellerStats.map(item => ({
        name: item.seller,
        count: item._count.id
      })),
      ratingDistribution: ratingStats.map(item => ({
        rating: item.rating,
        count: item._count.id
      }))
    }
  }

  /**
   * Transform Prisma product to our Product interface
   */
  private static transformProduct(product: any): Product {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      category: product.category,
      subcategory: product.subcategory,
      platform: product.platform,
      region: product.region,
      digital: product.digital,
      inStock: product.inStock,
      stockCount: product.stockCount,
      images: product.images,
      tags: product.tags,
      rating: product.rating,
      reviews: product.reviewCount,
      seller: product.seller,
      deliveryTime: product.deliveryTime,
      requirements: product.requirements,
      features: product.features,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }
  }

  /**
   * Get filter statistics for all products (used in initial page loads)
   */
  static async getFilterStats(products?: Product[]): Promise<FilterStats> {
    return this.getFilterStats({})
  }
}

// Export for backward compatibility
export const DataService = DatabaseService