import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '../../../../lib/data';
import { SearchFilters } from '../../../../types';

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
    const tags = searchParams.get('tags')?.split(',') || undefined;
    
    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const priceRange = minPrice && maxPrice ? {
      min: parseFloat(minPrice),
      max: parseFloat(maxPrice)
    } : undefined;

    const filters: SearchFilters = {
      category,
      subcategory,
      platform,
      priceRange,
      region,
      inStock,
      discount,
      tags,
    };

    const result = await DataService.searchProducts(query, filters, page, limit);

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

export async function POST(request: NextRequest) {
  try {
    // This would be for creating new products (admin only)
    return NextResponse.json(
      {
        success: false,
        error: 'Product creation not implemented',
      },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
} 