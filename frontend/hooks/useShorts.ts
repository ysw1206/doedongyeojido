import useSWR from 'swr';
import { 
  fetchShorts, 
  fetchPopularShorts,
  fetchShortsByCategory
} from '@/services/shortsService';
import type { ShortsListQuery } from '@/types/api';

/**
 * 쇼츠 영상 목록 조회 훅
 */
export const useShorts = (query?: ShortsListQuery) => {
  const key = query 
    ? `/api/shorts?${new URLSearchParams(query as Record<string, string>).toString()}` 
    : '/api/shorts';
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetchShorts(query),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return { 
    shorts: data?.shorts || [],
    pagination: data?.pagination,
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 인기 쇼츠 영상 조회 훅
 */
export const usePopularShorts = (limit: number = 8) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/shorts/popular?limit=${limit}`,
    () => fetchPopularShorts(limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return { 
    shorts: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 카테고리별 쇼츠 영상 조회 훅
 */
export const useShortsByCategory = (category?: string, limit: number = 8) => {
  const { data, error, isLoading, mutate } = useSWR(
    category ? `/api/shorts/category/${category}?limit=${limit}` : null,
    () => category ? fetchShortsByCategory(category, limit) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return { 
    shorts: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};
