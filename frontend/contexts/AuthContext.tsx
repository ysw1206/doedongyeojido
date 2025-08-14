"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout: clearUserStore, setUser: setStoreUser, setToken, initializeFromStorage } = useUserStore();

  useEffect(() => {
    // 초기 세션 확인 및 Auth 상태 변화 감지
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth state...');
        
        // 현재 세션 가져오기
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Session retrieval error:', error);
          setUser(null);
          setSession(null);
          return;
        }

        console.log('AuthContext: Current session:', currentSession);

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // 사용자 스토어 업데이트
          await updateUserStore(currentSession.user);
          
          // 토큰 저장
          setToken(currentSession.access_token);
        } else {
          setUser(null);
          setSession(null);
          // 로컬 스토리지에서 초기화 시도
          initializeFromStorage();
        }
      } catch (error) {
        console.error('AuthContext: Auth initialization error:', error);
        setUser(null);
        setSession(null);
        // 에러 발생 시 로컬 스토리지에서 초기화 시도
        initializeFromStorage();
      } finally {
        setLoading(false);
      }
    };

    // 사용자 스토어 업데이트 함수
    const updateUserStore = async (currentUser: User) => {
      try {
        // 먼저 사용자 프로필 생성/업데이트
        const profileData = await authService.createOrUpdateUserProfile(currentUser);

        const userData = {
          id: currentUser.id,
          name: profileData?.name || 
                currentUser.user_metadata?.nickname || 
                currentUser.user_metadata?.name || 
                currentUser.user_metadata?.full_name ||
                currentUser.email?.split('@')[0] || 
                '사용자',
          email: currentUser.email || '',
          role: 'user',
          avatar: profileData?.avatar || 
                  currentUser.user_metadata?.avatar_url || 
                  currentUser.user_metadata?.picture,
          kakao_id: profileData?.kakao_id,
          phone: profileData?.phone
        };

        console.log('AuthContext: Setting user store data:', userData);
        setStoreUser(userData);
      } catch (error) {
        console.error('AuthContext: User store update error:', error);
        // 에러가 발생해도 기본 사용자 정보는 설정
        setStoreUser({
          id: currentUser.id,
          name: currentUser.user_metadata?.name || 
                currentUser.user_metadata?.nickname ||
                currentUser.email?.split('@')[0] || '사용자',
          email: currentUser.email || '',
          role: 'user',
          avatar: currentUser.user_metadata?.avatar_url || 
                  currentUser.user_metadata?.picture
        });
      }
    };

    // 인증 상태 변화 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('AuthContext: Auth state changed:', event, newSession);
        
        if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          setUser(newSession.user);
          setToken(newSession.access_token);
          await updateUserStore(newSession.user);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          clearUserStore();
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          setSession(newSession);
          setToken(newSession.access_token);
        }
        
        setLoading(false);
      }
    );

    // 초기화
    initializeAuth();

    // 클린업
    return () => {
      subscription?.unsubscribe();
    };
  }, [setStoreUser, setToken, clearUserStore, initializeFromStorage]);

  const login = async () => {
    try {
      await authService.signInWithKakao();
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      clearUserStore();
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        setToken(refreshedSession.access_token);
      }
    } catch (error) {
      console.error('AuthContext: Session refresh error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}