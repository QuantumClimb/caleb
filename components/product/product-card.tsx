'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { cn, formatPrice } from '../../lib/utils';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={cn("group overflow-hidden", className)}>
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-video relative overflow-hidden bg-muted">
            <Image
              src={product.images[0] || '/placeholder-game.jpg'}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount && (
            <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
          {product.digital && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
              Digital
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            onAddToWishlist?.(product);
          }}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isInWishlist ? "fill-current text-destructive" : "text-muted-foreground"
            )}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Category & Platform */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{product.category}</span>
            <div className="flex gap-1">
              {product.platform.slice(0, 2).map((platform) => (
                <span key={platform} className="bg-muted px-1.5 py-0.5 rounded">
                  {platform}
                </span>
              ))}
              {product.platform.length > 2 && (
                <span className="bg-muted px-1.5 py-0.5 rounded">
                  +{product.platform.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              <span className="text-xs text-muted-foreground ml-1">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{product.deliveryTime}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
} 