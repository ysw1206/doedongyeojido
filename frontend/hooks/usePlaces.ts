import useSWR from 'swr';
import { 
  fetchPlaces, 
  fetchPlace, 
  searchPlaces, 
  fetchPlaceCategories,
  fetchNearbyPlaces,
  fetchRecommendedPlaces,
  fetchPopularPlaces
} from '@/services/placeService';
import type { PlaceListQuery, SearchFilters } from '@/types/api';

/**
 * 장소 목록 조회 훅
 */
export const usePlaces = (query?: PlaceListQuery) => {
  const key = query 
    ? `/api/places?${new URLSearchParams(query as Record<string, string>).toString()}` 
    : '/api/places';
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetchPlaces(query),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return { 
    places: data?.places || [],
    pagination: data?.pagination,
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 특정 장소 상세 조회 훅
 */
export const usePlace = (placeId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    placeId ? `/api/places/${placeId}` : null,
    () => placeId ? fetchPlace(placeId) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
    }
  );

  return { 
    place: data,
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 장소 검색 훅
 */
export const useSearchPlaces = (query?: string, filters?: SearchFilters) => {
  const searchKey = query ? `/api/places/search?q=${encodeURIComponent(query)}` : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    searchKey,
    () => query ? searchPlaces(query, filters) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      errorRetryCount: 2,
    }
  );

  return { 
    places: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 카테고리 목록 조회 훅
 */
export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/places/categories',
    fetchPlaceCategories,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5분
      errorRetryCount: 3,
    }
  );

  return { 
    categories: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 인근 장소 조회 훅
 */
export const useNearbyPlaces = (lat?: number, lng?: number, radius?: number, limit?: number) => {
  const key = lat && lng 
    ? `/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}` 
    : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => lat && lng ? fetchNearbyPlaces(lat, lng, radius, limit) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      errorRetryCount: 2,
    }
  );

  return { 
    places: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 추천 장소 조회 훅
 */
export const useRecommendedPlaces = (userId?: string, limit?: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/places/recommended',
    () => fetchRecommendedPlaces(userId, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30초
      errorRetryCount: 3,
    }
  );

  return { 
    places: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 인기 장소 조회 훅
 */
export const usePopularPlaces = (category?: string, limit?: number) => {
  const key = `/api/places/popular${category ? `?category=${category}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetchPopularPlaces(category, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1분
      errorRetryCount: 3,
    }
  );

  return { 
    places: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};