import { NextRequest, NextResponse } from 'next/server';

/**
 * 카테고리 목록 조회 API
 * GET /api/places/categories
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 실제 데이터베이스에서 카테고리 조회
    const categories = [
      {
        id: 'tourist-attraction',
        name: '관광지',
        icon: '🏛️',
        color: '#FF6B6B',
        description: '궁궐, 사원, 박물관 등 역사적 명소'
      },
      {
        id: 'restaurant',
        name: '맛집',
        icon: '🍽️',
        color: '#4ECDC4',
        description: '한식, 양식, 일식 등 다양한 음식점'
      },
      {
        id: 'cafe',
        name: '카페',
        icon: '☕',
        color: '#45B7D1',
        description: '커피숍, 디저트 카페, 베이커리'
      },
      {
        id: 'shopping',
        name: '쇼핑',
        icon: '🛍️',
        color: '#96CEB4',
        description: '백화점, 시장, 쇼핑몰'
      },
      {
        id: 'entertainment',
        name: '오락',
        icon: '🎪',
        color: '#FFEAA7',
        description: '놀이공원, 영화관, 노래방'
      },
      {
        id: 'nature',
        name: '자연',
        icon: '🌳',
        color: '#74B9FF',
        description: '공원, 산, 강, 해변'
      },
      {
        id: 'culture',
        name: '문화',
        icon: '🎭',
        color: '#A29BFE',
        description: '극장, 미술관, 문화센터'
      },
      {
        id: 'accommodation',
        name: '숙박',
        icon: '🏨',
        color: '#FD79A8',
        description: '호텔, 펜션, 게스트하우스'
      }
    ];

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}