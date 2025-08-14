// API 응답 기본 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// 에러 응답 타입
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
}

// 사용자 프로필 타입
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  kakao_id?: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
}

// 인증 세션 타입
export interface AuthSession {
  user: UserProfile;
  token: string;
  expires_at: string;
}

// 장소 관련 확장 타입
export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface ContactInfo {
  phone?: string;
  website?: string;
  email?: string;
}

export interface PlaceExtended {
  id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  tags: string[];
  openingHours?: OpeningHours;
  contact?: ContactInfo;
  createdAt: string;
  updatedAt: string;
}

// 장소 요청 타입들
export interface CreatePlaceRequest {
  name: string;
  description: string;
  address: string;
  category: string;
  images?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  tags?: string[];
  openingHours?: OpeningHours;
  contact?: ContactInfo;
}

export interface UpdatePlaceRequest {
  name?: string;
  description?: string;
  address?: string;
  category?: string;
  images?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  tags?: string[];
  openingHours?: OpeningHours;
  contact?: ContactInfo;
}

// 장소 쿼리 타입
export interface PlaceListQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  tags?: string[];
  sortBy?: 'name' | 'rating' | 'distance' | 'createdAt' | 'reviewCount';
  sortOrder?: 'asc' | 'desc';
}

// 검색 필터 타입
export interface SearchFilters {
  categories?: string[];
  tags?: string[];
  minRating?: number;
  maxDistance?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

// 장소 응답 타입들
export interface PlaceResponse extends ApiResponse<PlaceExtended> {}
export interface PlaceListResponse extends PaginatedResponse<PlaceExtended> {}
export interface PlaceSearchResponse extends ApiResponse<PlaceExtended[]> {}

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface CategoryResponse extends ApiResponse<Category[]> {}

// 리뷰 타입
export interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  placeId: string;
  rating: number;
  content: string;
  images?: string[];
}

export interface ReviewResponse extends ApiResponse<Review> {}
export interface ReviewListResponse extends PaginatedResponse<Review> {}

// 즐겨찾기 타입
export interface Favorite {
  id: string;
  userId: string;
  placeId: string;
  createdAt: string;
}

export interface FavoriteResponse extends ApiResponse<Favorite> {}
export interface FavoriteListResponse extends ApiResponse<PlaceExtended[]> {}

// 인증 관련 요청/응답 타입
export interface LoginRequest {
  provider: 'kakao';
  redirectUrl?: string;
}

export interface LoginResponse extends ApiResponse<AuthSession> {}

export interface UserProfileResponse extends ApiResponse<UserProfile> {}
export interface UserProfileUpdateRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}