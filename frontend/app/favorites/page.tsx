'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import CategoryFilter from '@/components/filter/CategoryFilter'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useFavorites } from '@/hooks'
import PlaceCard from '@/components/place/PlaceCard'

// 샘플 찜한 맛집 데이터
const sampleFavoritePlaces = [
  {
    id: '1',
    title: '강남역 맛집! 1인분도 가능한 이자카야 추천',
    description: '강남역 근처에 숨겨진 진짜 이자카야를 발견했습니다!',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=320&h=180&fit=crop&crop=center',
    videoId: '8jLOx1hD3_o',
    category: '일식',
    youtuberCount: 3,
    youtuberName: '먹방유튜버 김철수',
    viewCount: '12.5만회',
    uploadTime: '2주 전',
    duration: '12:34',
    favoriteDate: '3일 전 찜함',
    location: '강남구',
    distance: '500m'
  },
  {
    id: '2',
    title: '홍대 디저트 맛집 탐방! 인스타 감성 카페 3곳',
    description: '홍대에서 발견한 숨겨진 디저트 맛집들을 소개합니다.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=320&h=180&fit=crop&crop=center',
    videoId: 'abc123',
    category: '디저트',
    youtuberCount: 5,
    youtuberName: '카페투어 이영희',
    viewCount: '8.2만회',
    uploadTime: '1주 전',
    duration: '8:45',
    favoriteDate: '1주 전 찜함',
    location: '마포구',
    distance: '1.2km'
  },
  {
    id: '3',
    title: '신촌 술집 맛집! 대학생들이 추천하는 맛집',
    description: '신촌에서 대학생들이 즐겨 찾는 술집들을 소개합니다.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=320&h=180&fit=crop&crop=center',
    videoId: 'def456',
    category: '술집',
    youtuberCount: 2,
    youtuberName: '술집탐방 박민수',
    viewCount: '5.7만회',
    uploadTime: '3일 전',
    duration: '15:22',
    favoriteDate: '5일 전 찜함',
    location: '서대문구',
    distance: '800m'
  },
  {
    id: '4',
    title: '종로 한식 맛집! 전통 한옥에서 즐기는 한정식',
    description: '종로에서 전통 한옥의 분위기를 느낄 수 있는 한정식 맛집.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=320&h=180&fit=crop&crop=center',
    videoId: 'ghi789',
    category: '한식',
    youtuberCount: 7,
    youtuberName: '한식맛집 최지영',
    viewCount: '15.3만회',
    uploadTime: '1주 전',
    duration: '10:15',
    favoriteDate: '1주 전 찜함',
    location: '종로구',
    distance: '2.1km'
  },
  {
    id: '5',
    title: '마포구 중식 맛집! 진짜 중국인이 운영하는 짜장면',
    description: '마포구에서 중국인이 직접 운영하는 진짜 짜장면 맛집.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=320&h=180&fit=crop&crop=center',
    videoId: 'jkl012',
    category: '중식',
    youtuberCount: 4,
    youtuberName: '중식맛집 김동현',
    viewCount: '9.1만회',
    uploadTime: '5일 전',
    duration: '6:42',
    favoriteDate: '2주 전 찜함',
    location: '마포구',
    distance: '1.5km'
  },
  {
    id: '6',
    title: '강남 양식 맛집! 데이트하기 좋은 이탈리안 레스토랑',
    description: '강남에서 데이트하기 좋은 분위기의 이탈리안 레스토랑.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=320&h=180&fit=crop&crop=center',
    videoId: 'mno345',
    category: '양식',
    youtuberCount: 6,
    youtuberName: '데이트맛집 이수진',
    viewCount: '7.8만회',
    uploadTime: '2일 전',
    duration: '11:28',
    favoriteDate: '1일 전 찜함',
    location: '강남구',
    distance: '300m'
  }
]

// 찜한 맛집 카드 컴포넌트
function FavoriteCard({ place }: { place: typeof sampleFavoritePlaces[0] }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [isFavorite, setIsFavorite] = useState(favorites.includes(place.id))

  const handleUnfavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(false)
    setFavorites(favorites.filter(fav => fav !== place.id))
    console.log('찜 해제:', place.id)
  }

  if (!isFavorite) return null

  return (
    <Link href={`/place/${place.id}`} className="block">
      <div className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors">
        <div className="relative">
          <img 
            src={place.image} 
            alt={place.title} 
            className="w-full aspect-video object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjM0Y0QjU5Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMzUuMzQ3IDkwIDAgMTI1LjM0NyAwIDE2MFYxODBIMzIwVjE2MEMzMjAgMTI1LjM0NyAyODQuNjUzIDkwIDE2MCA5MFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+'
            }}
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {place.duration}
          </div>
          <button 
            onClick={handleUnfavorite}
            className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center hover:from-pink-500 hover:to-pink-600 transition-all duration-200"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">{place.title}</h3>
          <p className="text-xs text-gray-400 mb-1">{place.youtuberName}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>조회수 {place.viewCount}</span>
            <span>•</span>
            <span>{place.uploadTime}</span>
            <span>•</span>
            <span>📍 {place.distance}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs bg-gradient-to-r from-pink-400 to-pink-500 text-white px-2 py-0.5 rounded">유튜버 {place.youtuberCount}명 방문</span>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{place.category}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700">
            <span className="text-xs text-gray-400">{place.favoriteDate}</span>
            <button 
              onClick={handleUnfavorite}
              className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              찜 해제
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function FavoritesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  
  // SWR 훅 사용
  const { favorites: userFavoritePlaces, isLoading, error, refresh } = useFavorites()
  
  // 로딩 및 에러 처리
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">즐겨찾기 데이터를 불러오는 중 오류가 발생했습니다</div>
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

  // 찜 통계 데이터
  const favoriteStats = {
    total: userFavoritePlaces.length,
    thisWeek: 0, // TODO: 실제 즐겨찾기 추가 날짜 계산
    thisMonth: 0 // TODO: 실제 즐겨찾기 추가 날짜 계산
  }

  // 지역별 분포
  const locationDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {}
    userFavoritePlaces.forEach(place => {
      // address에서 구 이름 추출 (예: "서울특별시 종로구 ..." -> "종로구")
      const addressParts = place.address.split(' ')
      const district = addressParts.find(part => part.includes('구')) || '기타'
      distribution[district] = (distribution[district] || 0) + 1
    })
    return distribution
  }, [userFavoritePlaces])

  // 필터링된 데이터 생성
  const filteredPlaces = useMemo(() => {
    let filtered = userFavoritePlaces

    // 카테고리 필터 적용
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(place => place.category === selectedCategory)
    }

    // 검색 필터 적용
    if (searchQuery.trim()) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 정렬 적용
    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        break
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case 'distance':
        // TODO: 실제 거리 계산 구현
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [selectedCategory, searchQuery, sortBy, userFavoritePlaces])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('검색:', searchQuery)
  }

  const handleVoiceSearch = () => {
    console.log('음성 검색')
  }

  const handleMobileFilterClick = () => {
    setMobileFilterOpen(true)
  }

  const handleClearFilters = () => {
    setSelectedCategory('all')
    setSortBy('recent')
  }

  const handleApplyFilters = () => {
    setMobileFilterOpen(false)
    console.log('필터가 적용되었습니다.')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 검색 바 */}
      <div className="px-6 py-4 bg-black border-b border-gray-800">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="찜한 맛집 검색" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-full text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-pink-500" 
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button 
            type="button"
            onClick={handleVoiceSearch}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </button>
        </form>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-6 py-3 bg-black border-b border-gray-800">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <main className="flex">
        {/* 사이드바 (데스크탑) */}
        <aside className="w-64 bg-black border-r border-gray-800 p-6 hidden xl:block">
          <div className="space-y-6">
            {/* 찜 통계 */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">찜 통계</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">총 찜한 맛집</span>
                  <span className="text-white font-medium">{favoriteStats.total}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">이번 주</span>
                  <span className="text-white">{favoriteStats.thisWeek}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">이번 달</span>
                  <span className="text-white">{favoriteStats.thisMonth}개</span>
                </div>
              </div>
            </div>

            {/* 지역별 분포 */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">지역별 분포</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(locationDistribution).map(([location, count]) => (
                  <div key={location} className="flex justify-between">
                    <span className="text-gray-300">{location}</span>
                    <span className="text-white">{count}개</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 정렬 옵션 */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">정렬</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="sort" 
                    value="recent"
                    checked={sortBy === 'recent'}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="accent-pink-500" 
                  />
                  <span className={sortBy === 'recent' ? 'text-white' : 'text-gray-400'}>최근 찜순</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="sort" 
                    value="popular"
                    checked={sortBy === 'popular'}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="accent-pink-500" 
                  />
                  <span className={sortBy === 'popular' ? 'text-white' : 'text-gray-400'}>인기순</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="sort" 
                    value="distance"
                    checked={sortBy === 'distance'}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="accent-pink-500" 
                  />
                  <span className={sortBy === 'distance' ? 'text-white' : 'text-gray-400'}>가까운 순</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* 찜한 맛집 목록 */}
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

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">찜한 맛집</h1>
            <p className="text-gray-400">총 {filteredPlaces.length}개의 맛집을 찜했습니다</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg animate-pulse h-64" />
              ))}
            </div>
          ) : filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlaces.map((place) => (
                <PlaceCard 
                  key={place.id}
                  id={place.id}
                  title={place.name}
                  description={place.description}
                  image={place.images[0] || ''}
                  category={place.category}
                  youtuberCount={0} // TODO: 실제 유튜버 카운트 데이터
                  distance="즐겨찾기"
                  rating={place.rating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {userFavoritePlaces.length === 0 
                  ? '아직 찜한 맛집이 없어요'
                  : '검색 결과가 없습니다'
                }
              </h2>
              <p className="text-gray-400">
                {userFavoritePlaces.length === 0 
                  ? '마음에 드는 맛집을 찾아서 하트를 눌러보세요!'
                  : '다른 검색어나 필터를 시도해보세요'
                }
              </p>
            </div>
          )}
        </section>
      </main>

      {/* 모바일 필터 모달 */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute inset-0 flex items-end lg:items-center justify-center">
            <div className="bg-black w-full lg:w-96 h-5/6 lg:h-auto max-h-screen overflow-y-auto rounded-t-lg lg:rounded-lg">
              {/* 모달 헤더 */}
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">찜한 맛집 필터</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* 모달 내용 */}
              <div className="p-4 space-y-6">
                {/* 찜 통계 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">찜 통계</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">총 찜한 맛집</span>
                      <span className="text-white font-medium">{favoriteStats.total}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">이번 주</span>
                      <span className="text-white">{favoriteStats.thisWeek}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">이번 달</span>
                      <span className="text-white">{favoriteStats.thisMonth}개</span>
                    </div>
                  </div>
                </div>

                {/* 지역별 분포 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">지역별 분포</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(locationDistribution).map(([location, count]) => (
                      <div key={location} className="flex justify-between">
                        <span className="text-gray-300">{location}</span>
                        <span className="text-white">{count}개</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 정렬 옵션 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">정렬</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobileSort" 
                        value="recent"
                        checked={sortBy === 'recent'}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="accent-pink-500" 
                      />
                      <span className={sortBy === 'recent' ? 'text-white' : 'text-gray-400'}>최근 찜순</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobileSort" 
                        value="popular"
                        checked={sortBy === 'popular'}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="accent-pink-500" 
                      />
                      <span className={sortBy === 'popular' ? 'text-white' : 'text-gray-400'}>인기순</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="mobileSort" 
                        value="distance"
                        checked={sortBy === 'distance'}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="accent-pink-500" 
                      />
                      <span className={sortBy === 'distance' ? 'text-white' : 'text-gray-400'}>가까운 순</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 모달 액션 버튼 */}
              <div className="p-4 border-t border-gray-800 flex gap-3">
                <button 
                  onClick={handleClearFilters}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  전체 해제
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white py-2 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all"
                >
                  필터 적용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 