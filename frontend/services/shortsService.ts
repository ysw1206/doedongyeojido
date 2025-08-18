import { get } from './api';
import {
  ShortsVideo,
  ShortsListResponse,
  ShortsListQuery,
} from '../types/api';

/**
 * 쇼츠 영상 목록 조회
 */
export const fetchShorts = async (query?: ShortsListQuery): Promise<{
  shorts: ShortsVideo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const res = await get<ShortsListResponse>('/api/shorts', query, true);
  return {
    shorts: res.data,
    pagination: res.pagination,
  };
};

/**
 * 인기 쇼츠 영상 조회
 */
export const fetchPopularShorts = async (limit: number = 8): Promise<ShortsVideo[]> => {
  const res = await get<ShortsListResponse>('/api/shorts/popular', { limit }, true);
  return res.data;
};

/**
 * 카테고리별 쇼츠 영상 조회
 */
export const fetchShortsByCategory = async (
  category: string, 
  limit: number = 8
): Promise<ShortsVideo[]> => {
  const res = await get<ShortsListResponse>('/api/shorts', { category, limit }, true);
  return res.data;
};
