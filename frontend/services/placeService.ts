import { get, post, put, del } from './api';
import {
  PlaceExtended,
  PlaceResponse,
  PlaceListResponse,
  PlaceSearchResponse,
  CreatePlaceRequest,
  UpdatePlaceRequest,
  PlaceListQuery,
  SearchFilters,
  Category,
  CategoryResponse,
  Review,
  ReviewResponse,
  ReviewListResponse,
  CreateReviewRequest,
  FavoriteResponse,
  FavoriteListResponse,
} from '../types/api';

/**
 * 장소 목록 조회
 */
export const fetchPlaces = async (query?: PlaceListQuery): Promise<{
  places: PlaceExtended[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const res = await get<PlaceListResponse>('/api/places', query, true);
  return {
    places: res.data,
    pagination: res.pagination,
  };
};

/**
 * 장소 상세 조회
 */
export const fetchPlace = async (placeId: string): Promise<PlaceExtended> => {
  const res = await get<PlaceResponse>(`/api/places/${placeId}`, null, true);
  return res.data;
};

/**
 * 장소 생성
 */
export const createPlace = async (placeData: CreatePlaceRequest): Promise<PlaceExtended> => {
  const res = await post<PlaceResponse>('/api/places', placeData);
  return res.data;
};

/**
 * 장소 정보 업데이트
 */
export const updatePlace = async (placeId: string, data: UpdatePlaceRequest): Promise<PlaceExtended> => {
  const res = await put<PlaceResponse>(`/api/places/${placeId}`, data);
  return res.data;
};

/**
 * 장소 삭제
 */
export const deletePlace = async (placeId: string): Promise<void> => {
  await del(`/api/places/${placeId}`);
};

/**
 * 장소 검색
 */
export const searchPlaces = async (
  query: string,
  filters?: SearchFilters
): Promise<PlaceExtended[]> => {
  const searchParams: any = { search: query };
  
  if (filters) {
    if (filters.categories?.length) {
      searchParams.categories = filters.categories.join(',');
    }
    if (filters.tags?.length) {
      searchParams.tags = filters.tags.join(',');
    }
    if (filters.minRating) {
      searchParams.minRating = filters.minRating;
    }
    if (filters.maxDistance) {
      searchParams.maxDistance = filters.maxDistance;
    }
    if (filters.priceRange) {
      searchParams.minPrice = filters.priceRange.min;
      searchParams.maxPrice = filters.priceRange.max;
    }
  }

  const res = await get<PlaceSearchResponse>('/api/places/search', searchParams, true);
  return res.data;
};

/**
 * 카테고리 목록 조회
 */
export const fetchPlaceCategories = async (): Promise<Category[]> => {
  const res = await get<CategoryResponse>('/api/places/categories', null, true);
  return res.data;
};

/**
 * 장소 리뷰 목록 조회
 */
export const fetchPlaceReviews = async (
  placeId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const res = await get<ReviewListResponse>(
    `/api/places/${placeId}/reviews`,
    { page, limit },
    true
  );
  return {
    reviews: res.data,
    pagination: res.pagination,
  };
};

/**
 * 리뷰 작성
 */
export const createReview = async (reviewData: CreateReviewRequest): Promise<Review> => {
  const res = await post<ReviewResponse>(`/api/places/${reviewData.placeId}/reviews`, reviewData);
  return res.data;
};

/**
 * 리뷰 수정
 */
export const updateReview = async (
  reviewId: string,
  data: Partial<CreateReviewRequest>
): Promise<Review> => {
  const res = await put<ReviewResponse>(`/api/reviews/${reviewId}`, data);
  return res.data;
};

/**
 * 리뷰 삭제
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await del(`/api/reviews/${reviewId}`);
};

/**
 * 즐겨찾기 목록 조회
 */
export const fetchFavorites = async (): Promise<PlaceExtended[]> => {
  const res = await get<FavoriteListResponse>('/api/users/favorites');
  return res.data;
};

/**
 * 즐겨찾기 추가
 */
export const addToFavorites = async (placeId: string): Promise<void> => {
  await post<FavoriteResponse>('/api/users/favorites', { placeId });
};

/**
 * 즐겨찾기 제거
 */
export const removeFromFavorites = async (placeId: string): Promise<void> => {
  await del(`/api/users/favorites/${placeId}`);
};

/**
 * 인근 장소 조회
 */
export const fetchNearbyPlaces = async (
  lat: number,
  lng: number,
  radius: number = 1000, // 미터 단위
  limit: number = 10
): Promise<PlaceExtended[]> => {
  const res = await get<PlaceListResponse>(
    '/api/places',
    {
      lat,
      lng,
      radius,
      limit,
      sortBy: 'distance',
    },
    true
  );
  return res.data;
};

/**
 * 추천 장소 조회
 */
export const fetchRecommendedPlaces = async (
  userId?: string,
  limit: number = 10
): Promise<PlaceExtended[]> => {
  const params: any = { limit, sortBy: 'rating', sortOrder: 'desc' };
  if (userId) {
    params.recommendFor = userId;
  }
  
  const res = await get<PlaceListResponse>('/api/places', params, true);
  return res.data;
};

/**
 * 인기 장소 조회
 */
export const fetchPopularPlaces = async (
  category?: string,
  limit: number = 10
): Promise<PlaceExtended[]> => {
  const params: any = { 
    limit, 
    sortBy: 'reviewCount', 
    sortOrder: 'desc'
  };
  
  if (category) {
    params.category = category;
  }
  
  const res = await get<PlaceListResponse>('/api/places', params, true);
  return res.data;
};