import { createClient } from '@supabase/supabase-js';
import { get, post, put } from './api';
import {
  UserProfile,
  UserProfileResponse,
  UserProfileUpdateRequest,
  LoginResponse,
  AuthSession,
} from '../types/api';

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authService = {
  /**
   * 카카오 소셜 로그인
   */
  signInWithKakao: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          scope: 'profile_nickname profile_image account_email'
        }
      }
    });
    
    if (error) {
      console.error('Kakao login error:', error);
      throw error;
    }
    return data;
  },

  /**
   * 현재 로그인된 사용자 정보 가져오기
   */
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * 사용자 세션 정보 가져오기
   */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * 사용자 프로필 생성 또는 업데이트
   */
  createOrUpdateUserProfile: async (user: any) => {
    const userMetadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};
    
    // 카카오에서 제공하는 정보 추출
    const kakaoId = appMetadata.provider_id || userMetadata.sub;
    const nickname = userMetadata.name || userMetadata.nickname || userMetadata.full_name || '사용자';
    const email = user.email;
    const avatarUrl = userMetadata.avatar_url || userMetadata.picture;

    try {
      // user_profiles 테이블에 데이터 생성/업데이트
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          kakao_id: kakaoId,
          name: nickname,
          email: email,
          avatar: avatarUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  },

  /**
   * 사용자 프로필 조회 (API 서버에서)
   */
  fetchUserProfile: async (): Promise<UserProfile> => {
    const res = await get<UserProfileResponse>('/api/auth/profile');
    return res.data;
  },

  /**
   * 사용자 프로필 업데이트 (API 서버에서)
   */
  updateUserProfile: async (data: UserProfileUpdateRequest): Promise<UserProfile> => {
    const res = await put<UserProfileResponse>('/api/auth/profile', data);
    return res.data;
  },

  /**
   * 로그아웃
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // 로컬 스토리지 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_profile');
    }
  },

  /**
   * 토큰 갱신
   */
  refreshSession: async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  },

  /**
   * 인증 상태 변화 리스너 등록
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * 사용자 정보를 로컬 스토리지에 저장
   */
  setUserToStorage: (user: UserProfile, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_profile', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
    }
  },

  /**
   * 로컬 스토리지에서 사용자 정보 가져오기
   */
  getUserFromStorage: (): { user: UserProfile | null; token: string | null } => {
    if (typeof window === 'undefined') {
      return { user: null, token: null };
    }

    try {
      const userStr = localStorage.getItem('user_profile');
      const token = localStorage.getItem('auth_token');
      const user = userStr ? JSON.parse(userStr) : null;
      return { user, token };
    } catch (error) {
      console.error('Error reading user from storage:', error);
      return { user: null, token: null };
    }
  },

  /**
   * 로컬 스토리지에서 사용자 정보 제거
   */
  clearUserStorage: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_profile');
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * 사용자 인증 여부 확인
   */
  isAuthenticated: (): boolean => {
    const { token } = authService.getUserFromStorage();
    return !!token;
  },

  /**
   * 이메일로 로그인 (개발용)
   */
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Email login error:', error);
      throw error;
    }
    return data;
  },

  /**
   * 이메일로 회원가입 (개발용)
   */
  signUpWithEmail: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });
    
    if (error) {
      console.error('Email signup error:', error);
      throw error;
    }
    return data;
  }
};

export default authService;