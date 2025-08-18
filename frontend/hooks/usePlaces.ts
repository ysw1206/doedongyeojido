import useSWR from 'swr';
import { 
  fetchPlaces, 
  fetchPlace, 
  searchPlaces, 
  fetchPlaceCategories,
  fetchNearbyPlaces,
  fetchRecommendedPlaces,
  fetchPopularPlaces,
  fetchPlaceReviews
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
      errorRetryInterval: 5000,
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
export const useSearchPlaces = (filters?: SearchFilters) => {
  const key = filters 
    ? `/api/places/search?${new URLSearchParams(filters as Record<string, string>).toString()}` 
    : null;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => filters ? searchPlaces(filters) : null,
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
 * 카테고리 목록 조회 훅
 */
export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/places/categories',
    fetchPlaceCategories,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1분
      errorRetryCount: 3,
      errorRetryInterval: 5000,
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
 * 주변 장소 조회 훅
 */
export const useNearbyPlaces = (params?: {
  lat?: number;
  lng?: number;
  radius?: number;
  category?: string;
  limit?: number;
  youtuberCount?: number;
  search?: string;
}) => {
  const key = params 
    ? `/api/places/nearby?${new URLSearchParams(params as Record<string, string>).toString()}` 
    : '/api/places/nearby';
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetchNearbyPlaces(params),
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
 * 추천 장소 조회 훅
 */
export const useRecommendedPlaces = (userId?: string, limit: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/places/recommended?userId=${userId || ''}&limit=${limit}`,
    () => fetchRecommendedPlaces(userId, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
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
export const usePopularPlaces = (category?: string, limit: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/places/popular?category=${category || ''}&limit=${limit}`,
    () => fetchPopularPlaces(category, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
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
 * 장소 리뷰 조회 훅
 */
export const usePlaceReviews = (placeId?: string, page: number = 1, limit: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR(
    placeId ? `/api/places/${placeId}/reviews?page=${page}&limit=${limit}` : null,
    () => placeId ? fetchPlaceReviews(placeId, page, limit) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return { 
    reviews: data?.reviews || [],
    pagination: data?.pagination,
    error, 
    isLoading, 
    refresh: mutate 
  };
};