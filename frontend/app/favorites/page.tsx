'use client'

import { useState, useEffect } from 'react'
import PlaceCard from '@/components/place/PlaceCard'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function FavoritesPage() {
  const [favorites] = useLocalStorage<string[]>('favorites', [])
  const [favoritesList, setFavoritesList] = useState<any[]>([])

  useEffect(() => {
    // 실제 구현에서는 API에서 즐겨찾기한 장소들을 가져올 예정
    // 지금은 더미 데이터로 대체
    const mockFavorites = [
      {
        id: '1',
        title: '즐겨찾기한 맛집 1',
        description: '자주 가는 단골집',
        image: '/images/favorite1.jpg',
        category: '한식',
        youtuberCount: 5,
        distance: '300m'
      }
    ]
    setFavoritesList(mockFavorites.filter(place => favorites.includes(place.id)))
  }, [favorites])

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-white">즐겨찾기</h1>
          <span className="text-pink-400 bg-pink-400 bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {favoritesList.length}개
          </span>
        </div>

        {favoritesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoritesList.map((place) => (
              <PlaceCard key={place.id} {...place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              아직 즐겨찾기한 맛집이 없어요
            </h2>
            <p className="text-gray-400">
              마음에 드는 맛집을 찾아서 하트를 눌러보세요!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}