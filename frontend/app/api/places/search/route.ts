import { NextRequest, NextResponse } from 'next/server';

/**
 * 장소 검색 API
 * GET /api/places/search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || searchParams.get('search');
    const categories = searchParams.get('categories')?.split(',');
    const tags = searchParams.get('tags')?.split(',');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const maxDistance = parseFloat(searchParams.get('maxDistance') || '10000');
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // TODO: 실제 검색 로직 구현
    const mockResults = [
      {
        id: 'place-1',
        name: '경복궁',
        description: '조선 왕조의 법궁으로 한국의 대표적인 궁궐입니다.',
        address: '서울특별시 종로구 사직로 161',
        category: '관광지',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
        coordinates: { lat: 37.5788408, lng: 126.9770184 },
        rating: 4.5,
        reviewCount: 1245,
        tags: ['궁궐', '역사', '전통건축'],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-03-10T14:20:00Z'
      }
    ].filter(place => {
      // 기본 텍스트 검색
      const matchesQuery = place.name.toLowerCase().includes(query.toLowerCase()) ||
                          place.description.toLowerCase().includes(query.toLowerCase());
      
      // 카테고리 필터
      const matchesCategory = !categories || categories.includes(place.category);
      
      // 태그 필터
      const matchesTags = !tags || tags.some(tag => place.tags.includes(tag));
      
      // 평점 필터
      const matchesRating = place.rating >= minRating;
      
      return matchesQuery && matchesCategory && matchesTags && matchesRating;
    });

    return NextResponse.json({
      success: true,
      data: mockResults,
      meta: {
        query,
        total: mockResults.length,
        filters: {
          categories,
          tags,
          minRating,
          maxDistance
        }
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}