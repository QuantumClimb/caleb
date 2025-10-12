"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { AdvancedFilter } from "../../../components/product/advanced-filters"
import { ProductGrid } from "../../../components/product/product-grid"
import { Search, Grid, List, Filter, SortAsc, SortDesc } from "lucide-react"
import { DataService, AdvancedFilters, SortOptions, FilterStats } from "../../../lib/data"
import { Product } from "../../../types"

interface ProductsPageState {
  products: Product[]
  filteredProducts: Product[]
  filters: AdvancedFilters
  sort: SortOptions
  stats: FilterStats
  loading: boolean
  error: string | null
  searchQuery: string
  currentPage: number
  totalPages: number
  totalProducts: number
  viewMode: "grid" | "list"
  showFilters: boolean
}

export default function ProductsPage() {
  const [state, setState] = useState<ProductsPageState>({
    products: [],
    filteredProducts: [],
    filters: {},
    sort: { field: "createdAt", direction: "desc" },
    stats: {
      totalProducts: 0,
      priceRange: { min: 0, max: 200 },
      categories: [],
      subcategories: [],
      platforms: [],
      regions: [],
      tags: [],
      sellers: [],
      ratingDistribution: []
    },
    loading: true,
    error: null,
    searchQuery: "",
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    viewMode: "grid",
    showFilters: false
  })

  // Load initial data
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      // Get all products and stats
      const allProducts = await DataService.getAllProducts()
      const stats = DataService.getFilterStats(allProducts)
      
      setState(prev => ({
        ...prev,
        products: allProducts,
        filteredProducts: allProducts,
        stats,
        totalProducts: allProducts.length,
        totalPages: Math.ceil(allProducts.length / 20),
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load products",
        loading: false
      }))
    }
  }

  // Search and filter products
  const searchAndFilter = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const result = await DataService.searchProductsAdvanced(
        state.filters,
        state.sort,
        state.currentPage,
        20
      )

      setState(prev => ({
        ...prev,
        filteredProducts: result.products,
        totalProducts: result.pagination.total,
        totalPages: result.pagination.totalPages,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Search failed",
        loading: false
      }))
    }
  }, [state.filters, state.sort, state.currentPage])

  // Update search and filters when dependencies change
  useEffect(() => {
    searchAndFilter()
  }, [searchAndFilter])

  const handleFiltersChange = (newFilters: AdvancedFilters) => {
    setState(prev => ({
      ...prev,
      filters: newFilters,
      currentPage: 1, // Reset to first page when filters change
    }))
  }

  const handleSortChange = (newSort: SortOptions) => {
    setState(prev => ({
      ...prev,
      sort: newSort,
      currentPage: 1, // Reset to first page when sort changes
    }))
  }

  const handleSearchChange = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      filters: { ...prev.filters, query },
      currentPage: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }))
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearAllFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {},
      searchQuery: "",
      currentPage: 1
    }))
  }

  const toggleFilters = () => {
    setState(prev => ({ ...prev, showFilters: !prev.showFilters }))
  }

  const toggleViewMode = () => {
    setState(prev => ({
      ...prev,
      viewMode: prev.viewMode === "grid" ? "list" : "grid"
    }))
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (state.filters.query) count++
    if (state.filters.categories?.length) count++
    if (state.filters.platforms?.length) count++
    if (state.filters.tags?.length) count++
    if (state.filters.priceRange) count++
    if (state.filters.minRating) count++
    if (state.filters.inStock !== undefined) count++
    if (state.filters.hasDiscount) count++
    if (state.filters.digital !== undefined) count++
    return count
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search games, gift cards, and more..."
                value={state.searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Results Count */}
              <div className="text-sm text-muted-foreground hidden md:block">
                {state.loading ? "Loading..." : `${state.totalProducts.toLocaleString()} results`}
              </div>

              {/* View Mode Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleViewMode}
                className="hidden md:flex"
              >
                {state.viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFilters}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm font-medium">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {state.filters.query && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{state.filters.query}"
                    <button onClick={() => handleSearchChange("")}>×</button>
                  </Badge>
                )}
                {state.filters.categories?.map((category: string) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <button onClick={() => {
                      const newCategories = state.filters.categories?.filter((c: string) => c !== category) || []
                      handleFiltersChange({ ...state.filters, categories: newCategories })
                    }}>×</button>
                  </Badge>
                ))}
                {state.filters.platforms?.map((platform: string) => (
                  <Badge key={platform} variant="secondary" className="gap-1">
                    {platform}
                    <button onClick={() => {
                      const newPlatforms = state.filters.platforms?.filter((p: string) => p !== platform) || []
                      handleFiltersChange({ ...state.filters, platforms: newPlatforms })
                    }}>×</button>
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="ml-auto text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${state.showFilters ? "block" : "hidden"} lg:block`}>
            <AdvancedFilter
              filters={state.filters}
              onFiltersChange={handleFiltersChange}
              sort={state.sort}
              onSortChange={handleSortChange}
              stats={state.stats}
              isOpen={true}
              onToggle={toggleFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {state.error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">Error: {state.error}</div>
                <Button onClick={loadProducts}>Retry</Button>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={state.filteredProducts}
                  loading={state.loading}
                  className={state.viewMode === "list" ? "grid-cols-1" : ""}
                />

                {/* Pagination */}
                {state.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(state.currentPage - 1)}
                        disabled={state.currentPage <= 1}
                      >
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, state.totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <Button
                              key={page}
                              variant={state.currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(state.currentPage + 1)}
                        disabled={state.currentPage >= state.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Load More Button for Mobile */}
                {state.currentPage < state.totalPages && (
                  <div className="mt-6 text-center lg:hidden">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(state.currentPage + 1)}
                      disabled={state.loading}
                    >
                      {state.loading ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 