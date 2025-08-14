import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    // 간단한 토큰 확인 (로컬 스토리지 기반)
    const authToken = req.cookies.get('auth_token')?.value;
    const hasSession = !!authToken;
    
    const { pathname } = req.nextUrl;
    
    // 인증이 필요한 페이지들
    const protectedPaths = [
      '/favorites',
      '/history',
      '/profile',
      '/settings'
    ];
    
    // 인증된 사용자만 접근 가능한 페이지
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    
    if (isProtectedPath && !hasSession) {
      // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // 이미 로그인한 사용자가 로그인 페이지에 접근하는 경우
    if (pathname.startsWith('/auth/login') && hasSession) {
      const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/';
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // 에러 발생 시 그대로 진행
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)/',
  ],
};