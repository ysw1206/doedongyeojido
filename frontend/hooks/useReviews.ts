import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { 
  fetchPlaceReviews, 
  createReview, 
  updateReview, 
  deleteReview 
} from '@/services/placeService';
import type { CreateReviewRequest } from '@/types/api';

/**
 * 장소 리뷰 목록 조회 훅
 */
export const usePlaceReviews = (placeId?: string, page: number = 1, limit: number = 10) => {
  const { data, error, isLoading, mutate } = useSWR(
    placeId ? `/api/places/${placeId}/reviews?page=${page}&limit=${limit}` : null,
    () => placeId ? fetchPlaceReviews(placeId, page, limit) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
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

/**
 * 리뷰 작성 훅
 */
export const useCreateReview = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/reviews',
    async (url: string, { arg }: { arg: CreateReviewRequest }) => {
      return await createReview(arg);
    },
    {
      onSuccess: (newReview, key, config) => {
        // 해당 장소의 리뷰 목록 갱신
        // mutate(`/api/places/${newReview.placeId}/reviews`);
      }
    }
  );

  return {
    createReview: trigger,
    isLoading: isMutating,
    error
  };
};

/**
 * 리뷰 수정 훅
 */
export const useUpdateReview = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/reviews',
    async (url: string, { arg }: { arg: { reviewId: string; data: Partial<CreateReviewRequest> } }) => {
      return await updateReview(arg.reviewId, arg.data);
    }
  );

  return {
    updateReview: trigger,
    isLoading: isMutating,
    error
  };
};

/**
 * 리뷰 삭제 훅
 */
export const useDeleteReview = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/reviews',
    async (url: string, { arg }: { arg: string }) => {
      await deleteReview(arg);
      return arg;
    }
  );

  return {
    deleteReview: trigger,
    isLoading: isMutating,
    error
  };
};