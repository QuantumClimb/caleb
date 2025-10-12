// CALEB Gaming Marketplace - Database-backed DataService
// This replaces the JSON-based data service with Neon database integration

import { prisma } from './prisma'
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
  stats?: FilterStats
}

/**
 * Database-backed DataService for CALEB Gaming Marketplace
 * Provides all the same methods as the original JSON-based service
 */
export class DataService {
  /**
   * Get all products
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      })
      
      return products.map(this.transformProduct)
    } catch (error) {
      console.error('Error fetching all products:', error)
      return []
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id }
      })
      
      return product ? this.transformProduct(product) : null
    } catch (error) {
      console.error('Error fetching product by ID:', error)
      return null
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: { category },
        orderBy: { createdAt: 'desc' }
      })
      
      return products.map(this.transformProduct)
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
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
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  }

  /**
   * Get products with deals/discounts
   */
  static async getDeals(limit: number = 6): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: {
          discount: { gt: 0 },
          inStock: true
        },
        orderBy: { discount: 'desc' },
        take: limit
      })
      
      return products.map(this.transformProduct)
    } catch (error) {
      console.error('Error fetching deals:', error)
      return []
    }
  }

  /**
   * Search products with text query
   */
  static async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { seller: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: { rating: 'desc' }
      })
      
      return products.map(this.transformProduct)
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
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
    try {
      // Build where clause
      const where: any = {}

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

      // Platform filter (array contains)
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
          { seller: { contains: filters.query, mode: 'insensitive' } }
        ]
      }

      // Build orderBy
      const orderBy: any = {}
      
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
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.product.count({ where })
      ])

      return {
        products: products.map(this.transformProduct),
        total,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Error in advanced search:', error)
      return {
        products: [],
        total: 0,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
  }

  /**
   * Get filter statistics
   */
  static async getFilterStats(products?: Product[]): Promise<FilterStats> {
    try {
      const [
        totalProducts,
        priceStats,
        categoryStats,
        subcategoryStats,
        regionStats,
        sellerStats,
        ratingStats
      ] = await Promise.all([
        prisma.product.count(),
        prisma.product.aggregate({
          _min: { price: true },
          _max: { price: true }
        }),
        prisma.product.groupBy({
          by: ['category'],
          _count: { id: true }
        }),
        prisma.product.groupBy({
          by: ['subcategory'],
          _count: { id: true }
        }),
        prisma.product.groupBy({
          by: ['region'],
          _count: { id: true }
        }),
        prisma.product.groupBy({
          by: ['seller'],
          _count: { id: true }
        }),
        prisma.product.groupBy({
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
        categories: categoryStats.map((item: any) => ({
          name: item.category,
          count: item._count.id
        })),
        subcategories: subcategoryStats.map((item: any) => ({
          name: item.subcategory,
          count: item._count.id
        })),
        platforms: [], // Will implement if needed
        regions: regionStats.map((item: any) => ({
          name: item.region,
          count: item._count.id
        })),
        tags: [], // Will implement if needed
        sellers: sellerStats.map((item: any) => ({
          name: item.seller,
          count: item._count.id
        })),
        ratingDistribution: ratingStats.map((item: any) => ({
          rating: item.rating,
          count: item._count.id
        }))
      }
    } catch (error) {
      console.error('Error getting filter stats:', error)
      return {
        totalProducts: 0,
        priceRange: { min: 0, max: 0 },
        categories: [],
        subcategories: [],
        platforms: [],
        regions: [],
        tags: [],
        sellers: [],
        ratingDistribution: []
      }
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
}