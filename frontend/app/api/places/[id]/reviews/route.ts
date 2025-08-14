import { NextRequest, NextResponse } from 'next/server';

/**
 * 장소 리뷰 목록 조회 API
 * GET /api/places/[id]/reviews
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id: placeId } = params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // TODO: 실제 데이터베이스에서 리뷰 조회
    const mockReviews = [
      {
        id: 'review-1',
        placeId,
        userId: 'user-1',
        userName: '김철수',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        rating: 5,
        content: '정말 멋진 곳이에요! 역사의 무게감을 느낄 수 있었습니다.',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
        createdAt: '2024-03-01T10:30:00Z',
        updatedAt: '2024-03-01T10:30:00Z'
      },
      {
        id: 'review-2',
        placeId,
        userId: 'user-2',
        userName: '이영희',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b484ff8b?w=150',
        rating: 4,
        content: '볼거리가 많아서 시간이 금방 갔어요. 다시 방문하고 싶습니다.',
        images: [],
        createdAt: '2024-02-28T15:20:00Z',
        updatedAt: '2024-02-28T15:20:00Z'
      }
    ];

    // 페이지네이션
    const total = mockReviews.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedReviews = mockReviews.slice(start, end);

    return NextResponse.json({
      success: true,
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Reviews API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

/**
 * 리뷰 작성 API
 * POST /api/places/[id]/reviews
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id: placeId } = params;
    const body = await request.json();

    // TODO: 사용자 인증 확인
    // TODO: 입력 유효성 검사
    const { rating, content, images } = body;

    if (!rating || !content) {
      return NextResponse.json(
        { success: false, error: 'Rating and content are required' },
        { status: 400 }
      );
    }

    // TODO: 데이터베이스에 리뷰 저장
    const newReview = {
      id: `review-${Date.now()}`,
      placeId,
      userId: 'current-user-id', // TODO: 실제 사용자 ID
      userName: '사용자', // TODO: 실제 사용자 이름
      userAvatar: null,
      rating,
      content,
      images: images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newReview,
      message: '리뷰가 성공적으로 작성되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}