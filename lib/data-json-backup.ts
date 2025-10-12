import { Product, SearchFilters, SearchResult } from '../types';
import gamesData from '../data/games-final.json';
import giftCardsData from '../data/gift-cards-final.json';
import topUpsData from '../data/top-ups-final.json';
import Fuse from 'fuse.js';

// Combine all product data
const allProductsData = [
  ...gamesData,
  ...giftCardsData,
  ...topUpsData
];

// Type assertion to ensure the data matches our Product interface
const products: Product[] = allProductsData as Product[];

export interface AdvancedFilters {
  // Search
  query?: string;
  
  // Categories
  categories?: string[];
  subcategories?: string[];
  
  // Price
  priceRange?: {
    min: number;
    max: number;
  };
  
  // Platforms
  platforms?: string[];
  
  // Other filters
  regions?: string[];
  inStock?: boolean;
  hasDiscount?: boolean;
  digital?: boolean;
  
  // Rating
  minRating?: number;
  
  // Tags
  tags?: string[];
  
  // Sellers
  sellers?: string[];
  
  // Date ranges
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface SortOptions {
  field: 'price' | 'name' | 'rating' | 'discount' | 'createdAt' | 'reviews' | 'popularity';
  direction: 'asc' | 'desc';
}

export interface FilterStats {
  totalProducts: number;
  priceRange: { min: number; max: number };
  categories: Array<{ name: string; count: number }>;
  subcategories: Array<{ name: string; count: number }>;
  platforms: Array<{ name: string; count: number }>;
  regions: Array<{ name: string; count: number }>;
  tags: Array<{ name: string; count: number }>;
  sellers: Array<{ name: string; count: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
}

export class DataService {
  private static products: Product[] = allProductsData as Product[];
  
  private static fuseOptions = {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'description', weight: 1 },
      { name: 'tags', weight: 1.5 },
      { name: 'category', weight: 1.2 },
      { name: 'subcategory', weight: 1.2 },
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
  };

  private static fuse = new Fuse(this.products, this.fuseOptions);

  static async getProducts(): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products;
  }

  static async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  static async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.find(product => product.id === id) || null;
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return products with high ratings and good reviews
    return this.products
      .filter(product => product.rating >= 4.0 && product.reviews >= 100)
      .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
      .slice(0, limit);
  }

  static async getDeals(limit: number = 6): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return products with discounts
    return this.products
      .filter(product => product.discount && product.discount > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, limit);
  }

  static async searchProducts(
    query: string,
    filters: SearchFilters,
    page: number = 1,
    limit: number = 12
  ): Promise<SearchResult> {
    // Convert old filters to new format
    const advancedFilters: AdvancedFilters = {
      query,
      categories: filters.category ? [filters.category] : undefined,
      subcategories: filters.subcategory ? [filters.subcategory] : undefined,
      platforms: filters.platform,
      regions: filters.region ? [filters.region] : undefined,
      priceRange: filters.priceRange,
      inStock: filters.inStock,
      hasDiscount: filters.discount,
      tags: filters.tags,
    };

    const result = await this.searchProductsAdvanced(advancedFilters, { field: 'createdAt', direction: 'desc' }, page, limit);
    
    return {
      products: result.products,
      total: result.pagination.total,
      page: result.pagination.page,
      totalPages: result.pagination.totalPages,
      filters,
    };
  }

  static getCategories(): string[] {
    const categories = [...new Set(this.products.map(product => product.category))];
    return categories.sort();
  }

  static getSubcategories(category?: string): string[] {
    let filteredProducts = this.products;
    if (category) {
      filteredProducts = this.products.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    const subcategories = [...new Set(filteredProducts.map(product => product.subcategory))];
    return subcategories.sort();
  }

  static getPlatforms(): string[] {
    const platforms = [...new Set(this.products.flatMap(product => product.platform))];
    return platforms.sort();
  }

  static getPriceRange(): { min: number; max: number } {
    const prices = this.products.map(product => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  // Get all products with advanced filtering and sorting
  static async searchProductsAdvanced(
    filters: AdvancedFilters = {},
    sort: SortOptions = { field: 'createdAt', direction: 'desc' },
    page: number = 1,
    limit: number = 12
  ) {
    let filteredProducts = [...this.products];

    // Apply text search
    if (filters.query && filters.query.trim()) {
      const fuseResults = this.fuse.search(filters.query.trim());
      const searchIds = new Set(fuseResults.map(result => result.item.id));
      filteredProducts = filteredProducts.filter(product => searchIds.has(product.id));
    }

    // Apply category filters
    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories!.includes(product.category)
      );
    }

    if (filters.subcategories && filters.subcategories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.subcategories!.includes(product.subcategory)
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      filteredProducts = filteredProducts.filter(product =>
        product.price >= min && product.price <= max
      );
    }

    // Apply platform filters
    if (filters.platforms && filters.platforms.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.platforms!.some(platform => product.platform.includes(platform))
      );
    }

    // Apply region filters
    if (filters.regions && filters.regions.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.regions!.includes(product.region)
      );
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.inStock === filters.inStock
      );
    }

    // Apply discount filter
    if (filters.hasDiscount) {
      filteredProducts = filteredProducts.filter(product =>
        product.discount && product.discount > 0
      );
    }

    // Apply digital filter
    if (filters.digital !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.digital === filters.digital
      );
    }

    // Apply rating filter
    if (filters.minRating !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.rating >= filters.minRating!
      );
    }

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }

    // Apply seller filters
    if (filters.sellers && filters.sellers.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.sellers!.includes(product.seller)
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filteredProducts = filteredProducts.filter(product => {
        const productDate = new Date(product.createdAt);
        const startDate = start ? new Date(start) : new Date('1970-01-01');
        const endDate = end ? new Date(end) : new Date();
        return productDate >= startDate && productDate <= endDate;
      });
    }

    // Apply sorting
    filteredProducts = this.sortProducts(filteredProducts, sort);

    // Calculate pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: this.getFilterStats(this.products), // Stats for filter UI
    };
  }

  // Sort products based on criteria
  private static sortProducts(products: Product[], sort: SortOptions): Product[] {
    return products.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'discount':
          comparison = (a.discount || 0) - (b.discount || 0);
          break;
        case 'reviews':
          comparison = a.reviews - b.reviews;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'popularity':
          // Popularity based on reviews count and rating
          const popularityA = a.reviews * a.rating;
          const popularityB = b.reviews * b.rating;
          comparison = popularityA - popularityB;
          break;
        default:
          comparison = 0;
      }

      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }

  // Get filter statistics for UI
  static getFilterStats(products: Product[] = this.products): FilterStats {
    const prices = products.map(p => p.price);
    const categories = new Map<string, number>();
    const subcategories = new Map<string, number>();
    const platforms = new Map<string, number>();
    const regions = new Map<string, number>();
    const tags = new Map<string, number>();
    const sellers = new Map<string, number>();
    const ratings = new Map<number, number>();

    products.forEach(product => {
      // Count categories
      categories.set(product.category, (categories.get(product.category) || 0) + 1);
      
      // Count subcategories
      subcategories.set(product.subcategory, (subcategories.get(product.subcategory) || 0) + 1);
      
      // Count platforms
      product.platform.forEach(platform => {
        platforms.set(platform, (platforms.get(platform) || 0) + 1);
      });
      
      // Count regions
      regions.set(product.region, (regions.get(product.region) || 0) + 1);
      
      // Count tags
      product.tags.forEach(tag => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
      
      // Count sellers
      sellers.set(product.seller, (sellers.get(product.seller) || 0) + 1);
      
      // Count ratings (rounded)
      const roundedRating = Math.floor(product.rating);
      ratings.set(roundedRating, (ratings.get(roundedRating) || 0) + 1);
    });

    return {
      totalProducts: products.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
      categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      subcategories: Array.from(subcategories.entries()).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      platforms: Array.from(platforms.entries()).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      regions: Array.from(regions.entries()).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      tags: Array.from(tags.entries()).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count).slice(0, 20), // Top 20 tags
      sellers: Array.from(sellers.entries()).map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      ratingDistribution: Array.from(ratings.entries()).map(([rating, count]) => ({ rating, count }))
        .sort((a, b) => b.rating - a.rating),
    };
  }

  // Autocomplete suggestions
  static getSearchSuggestions(query: string, limit: number = 5): string[] {
    if (!query || query.length < 2) return [];

    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();

    this.products.forEach(product => {
      // Add title matches
      if (product.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.title);
      }

      // Add tag matches
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          suggestions.add(tag);
        }
      });

      // Add category matches
      if (product.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.category);
      }

      if (product.subcategory.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.subcategory);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }
} 