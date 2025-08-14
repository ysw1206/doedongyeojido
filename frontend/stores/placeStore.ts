'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { PlaceExtended, Place } from '@/types'

interface PlaceStore {
  // 장소 데이터
  places: PlaceExtended[]
  currentPlace: PlaceExtended | null
  
  // 즐겨찾기
  favorites: string[]
  favoritesList: PlaceExtended[]
  
  // 최근 본 장소
  recentlyViewed: PlaceExtended[]
  
  // 검색 히스토리
  searchHistory: string[]
  
  // 로딩 상태
  loading: {
    places: boolean
    favorites: boolean
    search: boolean
  }
  
  // 페이지네이션
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Actions
  setPlaces: (places: PlaceExtended[]) => void
  addPlaces: (places: PlaceExtended[]) => void
  setCurrentPlace: (place: PlaceExtended | null) => void
  
  // 즐겨찾기 관련
  setFavorites: (favorites: string[]) => void
  addToFavorites: (placeId: string) => void
  removeFromFavorites: (placeId: string) => void
  toggleFavorite: (placeId: string) => void
  setFavoritesList: (places: PlaceExtended[]) => void
  
  // 최근 본 장소
  addToRecentlyViewed: (place: PlaceExtended) => void
  clearRecentlyViewed: () => void
  
  // 검색 히스토리
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  removeFromSearchHistory: (query: string) => void
  
  // 로딩 상태
  setLoading: (key: keyof PlaceStore['loading'], loading: boolean) => void
  
  // 페이지네이션
  setPagination: (pagination: Partial<PlaceStore['pagination']>) => void
  
  // 헬퍼 함수들
  getPlaceById: (id: string) => PlaceExtended | undefined
  isFavorite: (placeId: string) => boolean
  
  // 초기화
  reset: () => void
}

const isClient = typeof window !== 'undefined';

export const usePlaceStore = create<PlaceStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        places: [],
        currentPlace: null,
        favorites: [],
        favoritesList: [],
        recentlyViewed: [],
        searchHistory: [],
        loading: {
          places: false,
          favorites: false,
          search: false,
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        
        // Actions
        setPlaces: (places) => 
          set((state) => {
            state.places = places;
          }),
        
        addPlaces: (places) => 
          set((state) => {
            const existingIds = new Set(state.places.map(p => p.id));
            const newPlaces = places.filter(p => !existingIds.has(p.id));
            state.places.push(...newPlaces);
          }),
        
        setCurrentPlace: (place) => 
          set((state) => {
            state.currentPlace = place;
            
            // 최근 본 장소에 추가
            if (place) {
              get().addToRecentlyViewed(place);
            }
          }),
        
        // 즐겨찾기 관련
        setFavorites: (favorites) => 
          set((state) => {
            state.favorites = favorites;
          }),
        
        addToFavorites: (placeId) => 
          set((state) => {
            if (!state.favorites.includes(placeId)) {
              state.favorites.push(placeId);
            }
          }),
        
        removeFromFavorites: (placeId) => 
          set((state) => {
            state.favorites = state.favorites.filter(id => id !== placeId);
            state.favoritesList = state.favoritesList.filter(place => place.id !== placeId);
          }),
        
        toggleFavorite: (placeId) => 
          set((state) => {
            const isFavorite = state.favorites.includes(placeId);
            if (isFavorite) {
              state.favorites = state.favorites.filter(id => id !== placeId);
              state.favoritesList = state.favoritesList.filter(place => place.id !== placeId);
            } else {
              state.favorites.push(placeId);
              // 장소 정보가 있으면 favoritesList에도 추가
              const place = state.places.find(p => p.id === placeId);
              if (place && !state.favoritesList.find(p => p.id === placeId)) {
                state.favoritesList.push(place);
              }
            }
          }),
        
        setFavoritesList: (places) => 
          set((state) => {
            state.favoritesList = places;
            // favorites 배열도 동기화
            state.favorites = places.map(p => p.id);
          }),
        
        // 최근 본 장소
        addToRecentlyViewed: (place) => 
          set((state) => {
            // 기존에 있으면 제거
            state.recentlyViewed = state.recentlyViewed.filter(p => p.id !== place.id);
            // 맨 앞에 추가
            state.recentlyViewed.unshift(place);
            // 최대 20개까지만 유지
            if (state.recentlyViewed.length > 20) {
              state.recentlyViewed = state.recentlyViewed.slice(0, 20);
            }
          }),
        
        clearRecentlyViewed: () => 
          set((state) => {
            state.recentlyViewed = [];
          }),
        
        // 검색 히스토리
        addToSearchHistory: (query) => 
          set((state) => {
            const trimmedQuery = query.trim();
            if (!trimmedQuery) return;
            
            // 기존에 있으면 제거
            state.searchHistory = state.searchHistory.filter(q => q !== trimmedQuery);
            // 맨 앞에 추가
            state.searchHistory.unshift(trimmedQuery);
            // 최대 10개까지만 유지
            if (state.searchHistory.length > 10) {
              state.searchHistory = state.searchHistory.slice(0, 10);
            }
          }),
        
        clearSearchHistory: () => 
          set((state) => {
            state.searchHistory = [];
          }),
        
        removeFromSearchHistory: (query) => 
          set((state) => {
            state.searchHistory = state.searchHistory.filter(q => q !== query);
          }),
        
        // 로딩 상태
        setLoading: (key, loading) => 
          set((state) => {
            state.loading[key] = loading;
          }),
        
        // 페이지네이션
        setPagination: (pagination) => 
          set((state) => {
            Object.assign(state.pagination, pagination);
          }),
        
        // 헬퍼 함수들
        getPlaceById: (id) => {
          return get().places.find(place => place.id === id);
        },
        
        isFavorite: (placeId) => {
          return get().favorites.includes(placeId);
        },
        
        // 초기화
        reset: () => 
          set((state) => {
            state.places = [];
            state.currentPlace = null;
            state.favorites = [];
            state.favoritesList = [];
            state.recentlyViewed = [];
            state.searchHistory = [];
            state.loading = {
              places: false,
              favorites: false,
              search: false,
            };
            state.pagination = {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            };
          }),
      })),
      {
        name: 'place-storage',
        storage: isClient ? createJSONStorage(() => localStorage) : undefined,
        partialize: (state) => ({
          favorites: state.favorites,
          favoritesList: state.favoritesList,
          recentlyViewed: state.recentlyViewed,
          searchHistory: state.searchHistory,
        }),
      }
    ),
    {
      name: 'place-store',
    }
  )
)