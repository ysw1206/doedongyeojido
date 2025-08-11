'use client'

import { useState, useEffect } from 'react'
import PlaceCard from '@/components/place/PlaceCard'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function HistoryPage() {
  const [visited] = useLocalStorage<string[]>('visited', [])
  const [historyList, setHistoryList] = useState<any[]>([])

  useEffect(() => {
    // 실제 구현에서는 API에서 방문한 장소들을 가져올 예정
    // 지금은 더미 데이터로 대체
    const mockHistory = [
      {
        id: '1',
        title: '방문한 맛집 1',
        description: '지난주에 다녀온 곳',
        image: '/images/history1.jpg',
        category: '한식',
        youtuberCount: 3,
        distance: '500m',
        visitedAt: '2024-01-15'
      }
    ]
    setHistoryList(mockHistory.filter(place => visited.includes(place.id)))
  }, [visited])

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-white">방문 기록</h1>
          <span className="text-green-400 bg-green-400 bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {historyList.length}개
          </span>
        </div>

        {historyList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {historyList.map((place) => (
              <PlaceCard key={place.id} {...place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              아직 방문한 맛집이 없어요
            </h2>
            <p className="text-gray-400">
              맛집을 방문하고 체크인해보세요!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}