/**
 * 서비스 레이어 통합 인덱스
 * 모든 서비스들을 중앙에서 export
 */

// API 기본 서비스
export * from './api';

// 장소 관련 서비스
export * from './placeService';

// 쇼츠 관련 서비스
export * from './shortsService';

// 인증 관련 서비스
export { default as authService } from './authService';
export * from './authService';

// 모킹 관련 서비스
export * from './mock-interceptor';

// 서비스 별칭들 (편의성을 위해)
export {
  fetchPlaces,
  fetchPlace,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaces,
  fetchPlaceCategories,
  fetchPlaceReviews,
  createReview,
  updateReview,
  deleteReview,
  fetchFavorites,
  addToFavorites,
  removeFromFavorites,
  fetchNearbyPlaces,
  fetchRecommendedPlaces,
  fetchPopularPlaces,
} from './placeService';

export {
  fetchShorts,
  fetchPopularShorts,
  fetchShortsByCategory,
} from './shortsService';

// 타입들도 re-export
export type * from '../types/api';