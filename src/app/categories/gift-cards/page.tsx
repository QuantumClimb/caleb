"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Input } from "../../../../components/ui/input"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { AdvancedFilter } from "../../../../components/product/advanced-filters"
import { ProductGrid } from "../../../../components/product/product-grid"
import { Search, Grid, List, Filter, Gift } from "lucide-react"
import { DataService, AdvancedFilters, SortOptions, FilterStats } from "../../../../lib/data"
import { Product } from "../../../../types"

interface GiftCardsPageState {
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

export default function GiftCardsPage() {
  const [state, setState] = useState<GiftCardsPageState>({
    products: [],
    filteredProducts: [],
    filters: { categories: ["Gift Cards"] },
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

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const giftCardProducts = await DataService.getProductsByCategory("Gift Cards")
      const stats = DataService.getFilterStats(giftCardProducts)
      
      setState(prev => ({
        ...prev,
        products: giftCardProducts,
        filteredProducts: giftCardProducts,
        stats,
        totalProducts: giftCardProducts.length,
        totalPages: Math.ceil(giftCardProducts.length / 20),
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load gift cards",
        loading: false
      }))
    }
  }

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

  useEffect(() => {
    searchAndFilter()
  }, [searchAndFilter])

  const handleFiltersChange = (newFilters: AdvancedFilters) => {
    setState(prev => ({
      ...prev,
      filters: { ...newFilters, categories: ["Gift Cards"] },
      currentPage: 1,
    }))
  }

  const handleSortChange = (newSort: SortOptions) => {
    setState(prev => ({
      ...prev,
      sort: newSort,
      currentPage: 1,
    }))
  }

  const handleSearchChange = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      filters: { ...prev.filters, query, categories: ["Gift Cards"] },
      currentPage: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
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

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Gift Cards</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Perfect for any gamer! Choose from a wide selection of gaming gift cards and 
            digital credits for all major platforms and stores.
          </p>
        </div>
      </div>

      {/* Filter Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gift cards..."
                value={state.searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground hidden md:block">
                {state.loading ? "Loading..." : `${state.totalProducts.toLocaleString()} gift cards`}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleViewMode}
                className="hidden md:flex"
              >
                {state.viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleFilters}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 