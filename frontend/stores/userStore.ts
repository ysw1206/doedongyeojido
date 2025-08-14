'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  kakao_id?: string;
  phone?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeFromStorage: () => void;
}

const isClient = typeof window !== 'undefined';

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set, get) => ({
        user: null,
        isAuthenticated: false,
        token: null,
        
        setUser: (user) => 
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            
            // 로컬 스토리지에도 저장
            if (isClient) {
              localStorage.setItem('user_profile', JSON.stringify(user));
            }
          }),
        
        setToken: (token) => 
          set((state) => {
            state.token = token;
            
            // 로컬 스토리지에도 저장
            if (isClient) {
              localStorage.setItem('auth_token', token);
            }
          }),
        
        logout: () => 
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            
            // 로컬 스토리지에서 제거
            if (isClient) {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_profile');
              localStorage.removeItem('loggedIn');
            }
          }),
        
        updateUser: (updates) => 
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
              
              // 로컬 스토리지 업데이트
              if (isClient) {
                localStorage.setItem('user_profile', JSON.stringify(state.user));
              }
            }
          }),

        initializeFromStorage: () => {
          if (!isClient) return;
          
          try {
            const userStr = localStorage.getItem('user_profile');
            const token = localStorage.getItem('auth_token');
            
            if (userStr && token) {
              const user = JSON.parse(userStr);
              set((state) => {
                state.user = user;
                state.token = token;
                state.isAuthenticated = true;
              });
            }
          } catch (error) {
            console.error('Error initializing user from storage:', error);
            // 에러 발생 시 스토리지 정리
            localStorage.removeItem('user_profile');
            localStorage.removeItem('auth_token');
          }
        },
      })),
      {
        name: 'user-storage',
        storage: isClient ? createJSONStorage(() => localStorage) : undefined,
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token,
        }),
        // hydration 후 추가 초기화
        onRehydrateStorage: () => (state) => {
          state?.initializeFromStorage();
        },
      }
    ),
    {
      name: 'user-store',
    }
  )
);