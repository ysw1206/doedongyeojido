import { NextRequest, NextResponse } from 'next/server';

/**
 * 장소 목록 조회 API
 * GET /api/places
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 추출
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const tags = searchParams.get('tags')?.split(',');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // TODO: 실제 데이터베이스 쿼리 로직 구현
    // 지금은 목 데이터 반환
    const mockPlaces = [
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
      },
      {
        id: 'place-2',
        name: '남산타워',
        description: '서울의 랜드마크이자 사랑의 명소로 유명한 타워입니다.',
        address: '서울특별시 용산구 남산공원길 105',
        category: '관광지',
        images: ['https://images.unsplash.com/photo-1558991047-b93d1d9397c1'],
        coordinates: { lat: 37.5511694, lng: 126.9882266 },
        rating: 4.3,
        reviewCount: 892,
        tags: ['전망대', '야경', '데이트코스'],
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-03-15T16:45:00Z'
      }
    ];

    // 필터링 로직
    let filteredPlaces = mockPlaces;
    
    if (category) {
      filteredPlaces = filteredPlaces.filter(place => place.category === category);
    }
    
    if (search) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.name.includes(search) || place.description.includes(search)
      );
    }

    // 페이지네이션
    const total = filteredPlaces.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPlaces = filteredPlaces.slice(start, end);

    return NextResponse.json({
      success: true,
      data: paginatedPlaces,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 새 장소 생성 API
 * POST /api/places
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 입력 유효성 검사
    // TODO: 데이터베이스에 저장
    
    const newPlace = {
      id: `place-${Date.now()}`,
      ...body,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newPlace,
      message: '장소가 성공적으로 생성되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('Create place error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  }
}