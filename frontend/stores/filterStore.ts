'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { SearchFilters, Category } from '@/types/api';

interface LocationFilter {
  lat?: number;
  lng?: number;
  radius?: number; // 미터 단위
  address?: string;
}

interface SortOption {
  field: 'name' | 'rating' | 'distance' | 'reviewCount' | 'createdAt';
  order: 'asc' | 'desc';
}

interface FilterState {
  // 카테고리 필터
  selectedCategories: string[];
  availableCategories: Category[];
  
  // 태그 필터
  selectedTags: string[];
  availableTags: string[];
  
  // 평점 필터
  minRating: number;
  maxRating: number;
  
  // 위치 필터
  location: LocationFilter;
  
  // 가격 범위 필터
  priceRange: {
    min: number;
    max: number;
  };
  
  // 정렬 옵션
  sortBy: SortOption;
  
  // 검색 쿼리
  searchQuery: string;
  
  // 필터 활성화 상태
  isFilterActive: boolean;
  
  // Actions
  setSelectedCategories: (categories: string[]) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  clearCategories: () => void;
  
  setSelectedTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;
  
  setRatingRange: (min: number, max: number) => void;
  setMinRating: (rating: number) => void;
  setMaxRating: (rating: number) => void;
  
  setLocation: (location: LocationFilter) => void;
  clearLocation: () => void;
  
  setPriceRange: (min: number, max: number) => void;
  
  setSortBy: (field: SortOption['field'], order: SortOption['order']) => void;
  
  setSearchQuery: (query: string) => void;
  
  setAvailableCategories: (categories: Category[]) => void;
  setAvailableTags: (tags: string[]) => void;
  
  // 필터 상태 관리
  clearAllFilters: () => void;
  resetToDefault: () => void;
  
  // 헬퍼 함수들
  getActiveFiltersCount: () => number;
  getSearchFilters: () => SearchFilters;
  isFilterEmpty: () => boolean;
}

const defaultState = {
  selectedCategories: [],
  availableCategories: [],
  selectedTags: [],
  availableTags: [],
  minRating: 0,
  maxRating: 5,
  location: {},
  priceRange: {
    min: 0,
    max: 100000,
  },
  sortBy: {
    field: 'rating' as const,
    order: 'desc' as const,
  },
  searchQuery: '',
  isFilterActive: false,
};

const isClient = typeof window !== 'undefined';

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...defaultState,
        
        // Category actions
        setSelectedCategories: (categories) => 
          set((state) => {
            state.selectedCategories = categories;
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        addCategory: (category) => 
          set((state) => {
            if (!state.selectedCategories.includes(category)) {
              state.selectedCategories.push(category);
              state.isFilterActive = true;
            }
          }),
        
        removeCategory: (category) => 
          set((state) => {
            state.selectedCategories = state.selectedCategories.filter(c => c !== category);
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        clearCategories: () => 
          set((state) => {
            state.selectedCategories = [];
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        // Tag actions
        setSelectedTags: (tags) => 
          set((state) => {
            state.selectedTags = tags;
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        addTag: (tag) => 
          set((state) => {
            if (!state.selectedTags.includes(tag)) {
              state.selectedTags.push(tag);
              state.isFilterActive = true;
            }
          }),
        
        removeTag: (tag) => 
          set((state) => {
            state.selectedTags = state.selectedTags.filter(t => t !== tag);
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        clearTags: () => 
          set((state) => {
            state.selectedTags = [];
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        // Rating actions
        setRatingRange: (min, max) => 
          set((state) => {
            state.minRating = min;
            state.maxRating = max;
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        setMinRating: (rating) => 
          set((state) => {
            state.minRating = rating;
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        setMaxRating: (rating) => 
          set((state) => {
            state.maxRating = rating;
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        // Location actions
        setLocation: (location) => 
          set((state) => {
            state.location = location;
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        clearLocation: () => 
          set((state) => {
            state.location = {};
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        // Price actions
        setPriceRange: (min, max) => 
          set((state) => {
            state.priceRange = { min, max };
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        // Sort actions
        setSortBy: (field, order) => 
          set((state) => {
            state.sortBy = { field, order };
          }),
        
        // Search actions
        setSearchQuery: (query) => 
          set((state) => {
            state.searchQuery = query;
            state.isFilterActive = get().getActiveFiltersCount() > 0;
          }),
        
        // Available options
        setAvailableCategories: (categories) => 
          set((state) => {
            state.availableCategories = categories;
          }),
        
        setAvailableTags: (tags) => 
          set((state) => {
            state.availableTags = tags;
          }),
        
        // Filter management
        clearAllFilters: () => 
          set((state) => {
            state.selectedCategories = [];
            state.selectedTags = [];
            state.minRating = 0;
            state.maxRating = 5;
            state.location = {};
            state.priceRange = { min: 0, max: 100000 };
            state.searchQuery = '';
            state.isFilterActive = false;
          }),
        
        resetToDefault: () => 
          set((state) => {
            Object.assign(state, defaultState);
          }),
        
        // Helper functions
        getActiveFiltersCount: () => {
          const state = get();
          let count = 0;
          
          if (state.selectedCategories.length > 0) count++;
          if (state.selectedTags.length > 0) count++;
          if (state.minRating > 0) count++;
          if (state.maxRating < 5) count++;
          if (Object.keys(state.location).length > 0) count++;
          if (state.priceRange.min > 0 || state.priceRange.max < 100000) count++;
          if (state.searchQuery.trim()) count++;
          
          return count;
        },
        
        getSearchFilters: () => {
          const state = get();
          
          const filters: SearchFilters = {};
          
          if (state.selectedCategories.length > 0) {
            filters.categories = state.selectedCategories;
          }
          
          if (state.selectedTags.length > 0) {
            filters.tags = state.selectedTags;
          }
          
          if (state.minRating > 0) {
            filters.minRating = state.minRating;
          }
          
          if (state.location.lat && state.location.lng && state.location.radius) {
            filters.maxDistance = state.location.radius;
          }
          
          if (state.priceRange.min > 0 || state.priceRange.max < 100000) {
            filters.priceRange = {
              min: state.priceRange.min,
              max: state.priceRange.max,
            };
          }
          
          return filters;
        },
        
        isFilterEmpty: () => {
          return get().getActiveFiltersCount() === 0;
        },
      })),
      {
        name: 'filter-storage',
        storage: isClient ? createJSONStorage(() => localStorage) : undefined,
        partialize: (state) => ({
          selectedCategories: state.selectedCategories,
          selectedTags: state.selectedTags,
          minRating: state.minRating,
          maxRating: state.maxRating,
          priceRange: state.priceRange,
          sortBy: state.sortBy,
        }),
      }
    ),
    {
      name: 'filter-store',
    }
  )
);