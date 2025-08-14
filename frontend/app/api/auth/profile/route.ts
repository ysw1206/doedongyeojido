import { NextRequest, NextResponse } from 'next/server';

/**
 * 사용자 프로필 조회 API
 * GET /api/auth/profile
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 사용자 인증 확인
    // TODO: 실제 사용자 프로필 조회
    
    const mockProfile = {
      id: 'user-123',
      name: '김도에',
      email: 'doe@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      kakao_id: 'kakao_123456',
      phone: '010-1234-5678',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-15T10:30:00Z'
    };

    return NextResponse.json({
      success: true,
      data: mockProfile
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

/**
 * 사용자 프로필 수정 API
 * PUT /api/auth/profile
 */
export async function PUT(request: NextRequest) {
  try {
    // TODO: 사용자 인증 확인
    const body = await request.json();
    
    // TODO: 입력 유효성 검사
    // TODO: 데이터베이스 업데이트
    
    const updatedProfile = {
      id: 'user-123',
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: '프로필이 성공적으로 수정되었습니다.'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}