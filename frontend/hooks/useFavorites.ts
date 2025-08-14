import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { 
  fetchFavorites, 
  addToFavorites, 
  removeFromFavorites 
} from '@/services/placeService';
import { usePlaceStore } from '@/stores/placeStore';

/**
 * 즐겨찾기 목록 조회 훅
 */
export const useFavorites = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users/favorites',
    fetchFavorites,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      errorRetryCount: 3,
      onSuccess: (data) => {
        // 스토어에도 동기화
        const { setFavoritesList } = usePlaceStore.getState();
        setFavoritesList(data);
      }
    }
  );

  return { 
    favorites: data || [],
    error, 
    isLoading, 
    refresh: mutate 
  };
};

/**
 * 즐겨찾기 추가 훅
 */
export const useAddToFavorites = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/users/favorites',
    async (url: string, { arg }: { arg: string }) => {
      await addToFavorites(arg);
      return arg;
    },
    {
      onSuccess: (placeId) => {
        // 스토어 업데이트
        const { addToFavorites: addToStore } = usePlaceStore.getState();
        addToStore(placeId);
      }
    }
  );

  return {
    addToFavorites: trigger,
    isLoading: isMutating,
    error
  };
};

/**
 * 즐겨찾기 제거 훅
 */
export const useRemoveFromFavorites = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/users/favorites',
    async (url: string, { arg }: { arg: string }) => {
      await removeFromFavorites(arg);
      return arg;
    },
    {
      onSuccess: (placeId) => {
        // 스토어 업데이트
        const { removeFromFavorites: removeFromStore } = usePlaceStore.getState();
        removeFromStore(placeId);
      }
    }
  );

  return {
    removeFromFavorites: trigger,
    isLoading: isMutating,
    error
  };
};

/**
 * 즐겨찾기 토글 훅
 */
export const useToggleFavorite = () => {
  const addMutation = useAddToFavorites();
  const removeMutation = useRemoveFromFavorites();
  const { isFavorite } = usePlaceStore();

  const toggleFavorite = async (placeId: string) => {
    const isCurrentlyFavorite = isFavorite(placeId);
    
    if (isCurrentlyFavorite) {
      await removeMutation.removeFromFavorites(placeId);
    } else {
      await addMutation.addToFavorites(placeId);
    }
  };

  return {
    toggleFavorite,
    isLoading: addMutation.isLoading || removeMutation.isLoading,
    error: addMutation.error || removeMutation.error
  };
};