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
  const res = await post<PlaceResponse>('/api/places', placeData, true);
  return res.data;
};

/**
 * 장소 정보 수정
 */
export const updatePlace = async (placeId: string, placeData: UpdatePlaceRequest): Promise<PlaceExtended> => {
  const res = await put<PlaceResponse>(`/api/places/${placeId}`, placeData, true);
  return res.data;
};

/**
 * 장소 삭제
 */
export const deletePlace = async (placeId: string): Promise<void> => {
  await del(`/api/places/${placeId}`, null, true);
};

/**
 * 장소 검색
 */
export const searchPlaces = async (filters: SearchFilters): Promise<{
  places: PlaceExtended[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const res = await get<PlaceListResponse>('/api/places/search', filters, true);
  return {
    places: res.data,
    pagination: res.pagination,
  };
};

/**
 * 카테고리 목록 조회
 */
export const fetchPlaceCategories = async (): Promise<Category[]> => {
  const res = await get<CategoryResponse>('/api/places/categories', null, true);
  return res.data;
};

/**
 * 주변 장소 조회
 */
export const fetchNearbyPlaces = async (params?: {
  lat?: number;
  lng?: number;
  radius?: number;
  category?: string;
  limit?: number;
  youtuberCount?: number;
  search?: string;
}): Promise<{
  places: PlaceExtended[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const res = await get<PlaceListResponse>('/api/places/nearby', params, true);
  return {
    places: res.data,
    pagination: res.pagination,
  };
};

/**
 * 추천 장소 조회
 */
export const fetchRecommendedPlaces = async (userId?: string, limit: number = 10): Promise<PlaceExtended[]> => {
  const params = { userId, limit };
  const res = await get<PlaceListResponse>('/api/places/recommended', params, true);
  return res.data;
};

/**
 * 인기 장소 조회
 */
export const fetchPopularPlaces = async (category?: string, limit: number = 10): Promise<PlaceExtended[]> => {
  const params = { category, limit };
  const res = await get<PlaceListResponse>('/api/places/popular', params, true);
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
  const params = { page, limit };
  const res = await get<ReviewListResponse>(`/api/places/${placeId}/reviews`, params, true);
  return {
    reviews: res.data,
    pagination: res.pagination,
  };
};

/**
 * 리뷰 작성
 */
export const createReview = async (placeId: string, reviewData: CreateReviewRequest): Promise<Review> => {
  const res = await post<ReviewResponse>(`/api/places/${placeId}/reviews`, reviewData, true);
  return res.data;
};

/**
 * 리뷰 수정
 */
export const updateReview = async (reviewId: string, reviewData: Partial<CreateReviewRequest>): Promise<Review> => {
  const res = await put<ReviewResponse>(`/api/reviews/${reviewId}`, reviewData, true);
  return res.data;
};

/**
 * 리뷰 삭제
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await del(`/api/reviews/${reviewId}`, null, true);
};

/**
 * 즐겨찾기 목록 조회
 */
export const fetchFavorites = async (page: number = 1, limit: number = 10): Promise<{
  favorites: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const params = { page, limit };
  const res = await get<FavoriteListResponse>('/api/users/favorites', params, true);
  return {
    favorites: res.data,
    pagination: res.pagination,
  };
};

/**
 * 즐겨찾기 추가
 */
export const addToFavorites = async (placeId: string): Promise<any> => {
  const res = await post<FavoriteResponse>('/api/users/favorites', { placeId }, true);
  return res.data;
};

/**
 * 즐겨찾기 제거
 */
export const removeFromFavorites = async (placeId: string): Promise<void> => {
  await del(`/api/users/favorites/${placeId}`, null, true);
};