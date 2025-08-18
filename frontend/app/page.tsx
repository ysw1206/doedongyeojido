'use client'

import { useState, useMemo } from 'react'
import SearchSection from '@/components/layout/SearchSection'
import CategoryFilter from '@/components/filter/CategoryFilter'
import PlaceCard from '@/components/place/PlaceCard'
import ShortsSection from '@/components/shorts/ShortsSection'
import Sidebar from '@/components/layout/Sidebar'
import MobileFilterModal from '@/components/layout/MobileFilterModal'
import { usePlaces, useCategories, usePopularPlaces, usePopularShorts } from '@/hooks'
import { useFilterStore } from '@/stores/filterStore'

export default function HomePage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  
  // 필터 스토어 사용
  const {
    selectedCategories,
    searchQuery,
    sortBy,
    getSearchFilters,
    setSelectedCategories,
    setSearchQuery,
    clearAllFilters
  } = useFilterStore()
  
  // 현재 선택된 카테고리 (단일 선택을 위한 로컬 상태)
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // API 훅들 사용
  const { categories } = useCategories()
  
  // 장소 목록 쿼리 생성
  const placesQuery = useMemo(() => ({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery || undefined,
    sortBy: sortBy.field,
    sortOrder: sortBy.order,
    limit: 20
  }), [selectedCategory, searchQuery, sortBy])
  
  const { places, pagination, isLoading, error, refresh } = usePlaces(placesQuery)
  
  // 인기 장소도 가져오기 (홈페이지 상단용)
  const { places: popularPlaces } = usePopularPlaces(undefined, 8)

  // 인기 쇼츠 영상 가져오기
  const { shorts: popularShorts, isLoading: shortsLoading, error: shortsError } = usePopularShorts(8)

  // 필터 핸들러들
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category !== 'all') {
      setSelectedCategories([category])
    } else {
      setSelectedCategories([])
    }
  }

  const handleMobileFilterClick = () => {
    setMobileFilterOpen(true)
  }

  const handleClearFilters = () => {
    clearAllFilters()
    setSelectedCategory('all')
  }

  const handleApplyFilters = () => {
    setMobileFilterOpen(false)
  }

  // 로딩 및 에러 처리
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">데이터를 불러오는 중 오류가 발생했습니다</div>
          <button 
            onClick={() => refresh()}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <SearchSection 
        onSearch={handleSearchChange}
        onVoiceSearch={() => console.log('음성 검색')}
      />

      {/* 카테고리 필터 */}
      <div className="px-6 py-3 bg-black border-b border-gray-800">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <main className="flex">
        {/* 사이드바 (데스크탑) */}
        <Sidebar 
          selectedLocation=""
          onLocationChange={() => {}} // TODO: 위치 필터 구현
          selectedYoutuberCounts={[]}
          onYoutuberCountChange={() => {}} // TODO: 유튜버 카운트 필터 구현
        />

        {/* 맛집 영상 목록 (목록 모드) */}
        <section className="flex-1 p-6">
          {/* 모바일 필터 버튼 */}
          <div className="xl:hidden mb-4">
            <button 
              onClick={handleMobileFilterClick}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span>필터</span>
            </button>
          </div>

          {/* 숏츠 섹션 */}
          <ShortsSection 
            shorts={popularShorts} 
            isLoading={shortsLoading}
            error={shortsError}
          />

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg animate-pulse h-64" />
              ))}
            </div>
          )}

          {/* 맛집 목록 */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {places.map((place) => {
                  // 디버깅을 위한 로그
                  console.log('Place data:', place);
                  console.log('Image URL:', place.images?.[0]);
                  
                  return (
                    <PlaceCard
                      key={place.id}
                      id={place.id}
                      title={place.name}
                      description={place.description}
                      image={place.images?.[0] || ''}
                      videoId={place.videoId}
                      category={place.category}
                      youtuberCount={place.tags?.length || 0}
                      distance="거리 정보 없음"
                      rating={place.rating}
                      youtuberName={place.youtuberName}
                      viewCount={place.viewCount}
                      uploadTime={place.uploadTime}
                      duration={place.duration}
                    />
                  );
                })}
            </div>
          )}

          {/* 빈 상태 */}
          {!isLoading && places.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">검색 결과가 없습니다</div>
              <div className="text-gray-500 text-sm">다른 카테고리나 검색어를 시도해보세요</div>
            </div>
          )}

          {/* 페이지네이션 (추후 구현) */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 text-center">
              <div className="text-gray-400 text-sm">
                {pagination.page} / {pagination.totalPages} 페이지 
                (총 {pagination.total}개 장소)
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 모바일 필터 모달 */}
      <MobileFilterModal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        selectedLocation=""
        onLocationChange={() => {}} // TODO: 위치 필터 구현
        selectedYoutuberCounts={[]}
        onYoutuberCountChange={() => {}} // TODO: 유튜버 카운트 필터 구현
        onClearFilters={handleClearFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  )
}