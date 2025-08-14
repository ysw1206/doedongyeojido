import { NextRequest, NextResponse } from 'next/server';

/**
 * 즐겨찾기 제거 API
 * DELETE /api/users/favorites/[placeId]
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ placeId: string }> }
) {
  try {
    const params = await context.params;
    const { placeId } = params;

    // TODO: 사용자 인증 확인
    // TODO: 데이터베이스에서 즐겨찾기 제거

    return NextResponse.json({
      success: true,
      message: '즐겨찾기에서 제거되었습니다.'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}