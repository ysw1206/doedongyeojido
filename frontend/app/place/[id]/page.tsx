'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Props {
  params: { id: string }
}

export default function PlacePage({ params }: Props) {
  const [place, setPlace] = useState<any>(null)
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [visited, setVisited] = useLocalStorage<string[]>('visited', [])

  const isFavorited = favorites.includes(params.id)
  const isVisited = visited.includes(params.id)

  useEffect(() => {
    // 실제 구현에서는 API에서 장소 정보를 가져올 예정
    const mockPlace = {
      id: params.id,
      title: '유명한 맛집',
      description: '현지인들이 자주 찾는 숨은 맛집입니다.',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      category: '한식',
      rating: 4.5,
      reviewCount: 128,
      youtuberCount: 5,
      images: ['/images/place-detail.jpg'],
      openHours: '11:00 - 22:00',
      coordinates: { lat: 37.5665, lng: 126.9780 }
    }
    setPlace(mockPlace)
  }, [params.id])

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav !== params.id))
    } else {
      setFavorites([...favorites, params.id])
    }
  }

  const toggleVisited = () => {
    if (isVisited) {
      setVisited(visited.filter(visit => visit !== params.id))
    } else {
      setVisited([...visited, params.id])
    }
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-4xl mx-auto">
        {/* 이미지 섹션 */}
        <div className="relative h-64 md:h-80">
          <img 
            src={place.images[0] || '/images/placeholder.jpg'} 
            alt={place.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* 액션 버튼들 */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={toggleFavorite}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isFavorited ? 'bg-pink-500' : 'bg-black bg-opacity-60'
              }`}
            >
              <svg className="w-5 h-5 text-white" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button 
              onClick={toggleVisited}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isVisited ? 'bg-green-500' : 'bg-black bg-opacity-60'
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="px-6 py-6 space-y-6">
          {/* 기본 정보 */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{place.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                ⭐ {place.rating} ({place.reviewCount}개 리뷰)
              </span>
              <span className="text-pink-400">🐷 유튜버 {place.youtuberCount}명 방문</span>
            </div>
            <p className="text-gray-300">{place.description}</p>
          </div>

          {/* 연락처 및 주소 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">📍</span>
              <span className="text-white">{place.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">📞</span>
              <span className="text-white">{place.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">🕒</span>
              <span className="text-white">{place.openHours}</span>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors">
              길찾기
            </button>
            <button className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors">
              전화걸기
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}