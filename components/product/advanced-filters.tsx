'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { 
  X, 
  Filter, 
  Star, 
  DollarSign, 
  Tag, 
  Gamepad2,
  Zap,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { AdvancedFilters, SortOptions, FilterStats } from '../../lib/data';

interface AdvancedFilterProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  sort: SortOptions;
  onSortChange: (sort: SortOptions) => void;
  stats: FilterStats;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  stats,
  isOpen,
  onToggle
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceRange?.min || stats.priceRange.min,
    filters.priceRange?.max || stats.priceRange.max
  ]);

  const updateFilters = (newFilters: Partial<AdvancedFilters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([stats.priceRange.min, stats.priceRange.max]);
  };

  const toggleCategory = (category: string) => {
    const categories = filters.categories || [];
    const newCategories = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category];
    updateFilters({ categories: newCategories });
  };

  const togglePlatform = (platform: string) => {
    const platforms = filters.platforms || [];
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter(p => p !== platform)
      : [...platforms, platform];
    updateFilters({ platforms: newPlatforms });
  };

  const toggleTag = (tag: string) => {
    const tags = filters.tags || [];
    const newTags = tags.includes(tag)
      ? tags.filter(t => t !== tag)
      : [...tags, tag];
    updateFilters({ tags: newTags });
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.categories?.length) count++;
    if (filters.platforms?.length) count++;
    if (filters.tags?.length) count++;
    if (filters.priceRange) count++;
    if (filters.minRating) count++;
    if (filters.inStock !== undefined) count++;
    if (filters.hasDiscount) count++;
    if (filters.digital !== undefined) count++;
    return count;
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 lg:hidden"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {activeFilterCount() > 0 && (
          <Badge variant="destructive" className="ml-2">
            {activeFilterCount()}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className="lg:w-80 w-full h-fit">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Sort
            </CardTitle>
            <div className="flex items-center gap-2">
              {activeFilterCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sorting */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              Sort By
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={sort.field}
                onValueChange={(field) => onSortChange({ ...sort, field: field as SortOptions['field'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSortChange({ 
                  ...sort, 
                  direction: sort.direction === 'asc' ? 'desc' : 'asc' 
                })}
                className="flex items-center gap-1"
              >
                {sort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                {sort.direction === 'asc' ? 'A-Z' : 'Z-A'}
              </Button>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["categories", "price", "platforms"]} className="w-full">
            {/* Price Range */}
            <AccordionItem value="price">
              <AccordionTrigger className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Range
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => {
                      const newValue = value as [number, number];
                      setPriceRange(newValue);
                      const [min, max] = newValue;
                      updateFilters({ priceRange: { min, max } });
                    }}
                    max={stats.priceRange.max}
                    min={stats.priceRange.min}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Categories */}
            <AccordionItem value="categories">
              <AccordionTrigger className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Categories
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {stats.categories.map(({ name, count }) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.categories?.includes(name) || false}
                      onCheckedChange={() => toggleCategory(name)}
                    />
                    <label className="text-sm font-medium flex-1 cursor-pointer">
                      {name}
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Platforms */}
            <AccordionItem value="platforms">
              <AccordionTrigger className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Platforms
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {stats.platforms.map(({ name, count }) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.platforms?.includes(name) || false}
                      onCheckedChange={() => togglePlatform(name)}
                    />
                    <label className="text-sm font-medium flex-1 cursor-pointer">
                      {name}
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Rating */}
            <AccordionItem value="rating">
              <AccordionTrigger className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.minRating === rating}
                      onCheckedChange={(checked) => {
                        updateFilters({ minRating: checked ? rating : undefined });
                      }}
                    />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm ml-1">& up</span>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Popular Tags */}
            <AccordionItem value="tags">
              <AccordionTrigger className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Popular Tags
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {stats.tags.slice(0, 12).map(({ name, count }) => (
                    <Badge
                      key={name}
                      variant={filters.tags?.includes(name) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => toggleTag(name)}
                    >
                      {name} ({count})
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Quick Filters */}
            <AccordionItem value="quick">
              <AccordionTrigger className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Filters
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.inStock || false}
                    onCheckedChange={(checked) => updateFilters({ inStock: checked ? true : undefined })}
                  />
                  <label className="text-sm font-medium cursor-pointer">
                    In Stock Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.hasDiscount || false}
                    onCheckedChange={(checked) => updateFilters({ hasDiscount: checked ? true : undefined })}
                  />
                  <label className="text-sm font-medium cursor-pointer">
                    On Sale
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.digital === true}
                    onCheckedChange={(checked) => updateFilters({ digital: checked ? true : undefined })}
                  />
                  <label className="text-sm font-medium cursor-pointer">
                    Digital Only
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Active Filters */}
          {activeFilterCount() > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.categories?.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleCategory(category)}
                    />
                  </Badge>
                ))}
                {filters.platforms?.map((platform) => (
                  <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                    {platform}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => togglePlatform(platform)}
                    />
                  </Badge>
                ))}
                {filters.priceRange && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ${filters.priceRange.min} - ${filters.priceRange.max}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilters({ priceRange: undefined })}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 