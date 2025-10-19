"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { Product } from "../../types"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  className?: string
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice = product.originalPrice 
    ? product.originalPrice - (product.originalPrice * (product.discount || 0) / 100)
    : product.price

  return (
    <Card className="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="aspect-[4/3] relative">
          <Image
            src={product.images[0] || "/images/placeholder-game.jpg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discount && product.discount > 0 && (
              <Badge variant="destructive" className="text-xs font-bold">
                -{product.discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {product.digital && (
              <Badge variant="outline" className="text-xs bg-background/80">
                Digital
              </Badge>
            )}
          </div>

          {/* Platform icons */}
          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
            {product.platform.slice(0, 3).map((platform) => (
              <Badge key={platform} variant="secondary" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" className="bg-white/90 text-black hover:bg-white">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/90 text-black hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          {/* Category */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{product.category}</span>
            {product.subcategory && (
              <>
                <span>•</span>
                <span>{product.subcategory}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/products/${product.id}`}>
              {product.title}
            </Link>
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Seller and Delivery */}
          <div className="text-xs text-muted-foreground">
            <div>Seller: {product.seller}</div>
            <div>Delivery: {product.deliveryTime}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.originalPrice && product.discount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {product.stockCount > 0 ? `${product.stockCount} left` : ""}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              disabled={!product.inStock}
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const ProductGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i} className="h-full">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] bg-muted animate-pulse rounded-t-lg" />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-2">
            <div className="h-6 bg-muted animate-pulse rounded" />
            <div className="h-8 bg-muted animate-pulse rounded" />
          </div>
        </CardFooter>
      </Card>
    ))}
  </div>
)

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  className = "" 
}) => {
  if (loading) {
    return <ProductGridSkeleton />
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your filters or search criteria to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
} 