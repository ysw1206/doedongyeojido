'use client'

import { useState } from 'react'
import SearchSection from '@/components/layout/SearchSection'
import CategoryFilter from '@/components/filter/CategoryFilter'
import PlaceCard from '@/components/place/PlaceCard'
import ShortsSection from '@/components/shorts/ShortsSection'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 더미 데이터
  const mockPlaces = [
    {
      id: '1',
      title: '유명한 돼지국밥집',
      description: '현지인만 아는 숨은 맛집',
      image: '/images/place1.jpg',
      category: '한식',
      youtuberCount: 3,
      distance: '500m',
      rating: 4.5
    },
    {
      id: '2', 
      title: '레트로 감성 카페',
      description: '인스타 핫플레이스',
      image: '/images/place2.jpg',
      category: '카페',
      youtuberCount: 2,
      distance: '1.2km',
      rating: 4.3
    }
  ]

  const mockShorts = [
    {
      id: '1',
      title: '부산 맛집 탐방기',
      image: '/images/short1.jpg',
      duration: '0:59',
      viewCount: '1.2만회',
      videoId: 'abc123'
    },
    {
      id: '2',
      title: '서울 숨은 맛집',
      image: '/images/short2.jpg', 
      duration: '1:30',
      viewCount: '850회',
      videoId: 'def456'
    }
  ]

  // 카테고리에 따른 필터링
  const filteredPlaces = selectedCategory === 'all' 
    ? mockPlaces 
    : mockPlaces.filter(place => place.category === selectedCategory)

  return (
    <div className="min-h-screen bg-black">
      <SearchSection />
      
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* 카테고리 필터 */}
        <div className="mb-6">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Shorts 섹션 */}
        <ShortsSection shorts={mockShorts} />

        {/* 맛집 카드 그리드 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">인기 맛집</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} {...place} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}