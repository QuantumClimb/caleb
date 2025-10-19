import { NextRequest, NextResponse } from 'next/server';
import { DataService, AdvancedFilters } from '../../../../lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    const platform = searchParams.get('platform')?.split(',') || undefined;
    const region = searchParams.get('region') || undefined;
    const inStock = searchParams.get('inStock') === 'true' ? true : undefined;
    const discount = searchParams.get('discount') === 'true' ? true : undefined;
    
    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const priceRange = minPrice && maxPrice ? {
      min: parseFloat(minPrice),
      max: parseFloat(maxPrice)
    } : undefined;

    const filters: AdvancedFilters = {
      query,
      categories: category ? [category] : undefined,
      subcategories: subcategory ? [subcategory] : undefined,
      platforms: platform,
      priceRange,
      regions: region ? [region] : undefined,
      inStock,
      hasDiscount: discount,
      // Note: tags is not currently in AdvancedFilters interface
    };

    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'price' | 'rating' | 'title' | 'discount';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const sort = { field: sortBy, direction: sortOrder };
    const result = await DataService.searchProductsAdvanced(filters, sort, page, limit);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // This would be for creating new products (admin only)
    return NextResponse.json(
      {
        success: false,
        error: 'Product creation not implemented',
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
} 