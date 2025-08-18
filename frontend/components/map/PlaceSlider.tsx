'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'

interface Place {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  images?: string[]
  category?: string
  rating?: number
  tags?: string[]
  distance?: string
  youtuberName?: string
  viewCount?: string
  isFavorite?: boolean
}

interface PlaceSliderProps {
  places: Place[]
  selectedPlaceIndex: number
  onPlaceClick: (place: Place, index: number) => void
  onPlaceDetail: (place: Place) => void
  onFavoriteToggle: (placeId: string) => void
  onClose: () => void
}

export default function PlaceSlider({
  places,
  selectedPlaceIndex,
  onPlaceClick,
  onPlaceDetail,
  onFavoriteToggle,
  onClose
}: PlaceSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  // 선택된 아이템으로 스크롤 (프로그래밍 방식)
  const scrollToItem = useCallback((index: number) => {
    if (!sliderRef.current || index < 0) return

    const slider = sliderRef.current
    const items = slider.children
    if (index >= items.length) return

    const targetItem = items[index] as HTMLElement
    if (!targetItem) return

    // 실제 요소의 위치와 크기 측정
    const sliderRect = slider.getBoundingClientRect()
    const itemRect = targetItem.getBoundingClientRect()
    
    // 슬라이더 중앙 위치 계산
    const sliderCenter = sliderRect.width / 2
    const itemCenter = itemRect.left - sliderRect.left + slider.scrollLeft + (itemRect.width / 2)
    const scrollLeft = itemCenter - sliderCenter

    console.log('📍 스크롤 계산:', {
      index,
      sliderCenter,
      itemCenter,
      scrollLeft: Math.max(0, scrollLeft)
    })

    // 스크롤 중 플래그 설정
    setIsScrolling(true)
    
    slider.scrollTo({ 
      left: Math.max(0, scrollLeft), 
      behavior: 'smooth' 
    })

    // 스크롤 완료 후 플래그 해제
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 500) // 스무스 스크롤 완료 시간
  }, [])

  // selectedPlaceIndex 변경 시 스크롤
  useEffect(() => {
    if (selectedPlaceIndex >= 0) {
      scrollToItem(selectedPlaceIndex)
    }
  }, [selectedPlaceIndex, scrollToItem])

  // 수동 스크롤 이벤트 처리 (사용자가 직접 스크롤할 때만)
  const handleSliderScroll = useCallback(() => {
    // 프로그래밍 방식 스크롤 중에는 이벤트 무시
    if (isScrolling || !sliderRef.current) return
    
    const slider = sliderRef.current
    const items = slider.children
    const sliderRect = slider.getBoundingClientRect()
    const sliderCenter = sliderRect.width / 2

    let closestIndex = 0
    let closestDistance = Infinity

    // 각 아이템의 중심점과 슬라이더 중심점의 거리 계산
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement
      const itemRect = item.getBoundingClientRect()
      const itemCenter = itemRect.left - sliderRect.left + (itemRect.width / 2)
      const distance = Math.abs(itemCenter - sliderCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    // 현재 선택된 인덱스와 다른 경우에만 업데이트
    if (closestIndex !== selectedPlaceIndex && closestIndex < places.length) {
      const place = places[closestIndex]
      if (place) {
        console.log('🔄 수동 스크롤로 인한 선택 변경:', closestIndex)
        onPlaceClick(place, closestIndex)
      }
    }
  }, [isScrolling, selectedPlaceIndex, places, onPlaceClick])

  // cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  if (!places || places.length === 0) {
    return null
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 text-white p-4 z-30">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">주변 맛집 ({places.length})</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div
        ref={sliderRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleSliderScroll}
      >
        {places.map((place, index) => (
          <div
            key={place.id}
            onClick={() => {
              console.log('🏪 카드 클릭:', place.name, index)
              onPlaceClick(place, index)
            }}
            className={`flex-shrink-0 w-72 bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedPlaceIndex === index
                ? 'ring-2 ring-blue-400 border-2 border-blue-400 scale-105' 
                : 'hover:bg-gray-700'
            }`}
          >
            <div className="relative">
              <img
                src={place.images?.[0] || '/placeholder-image.jpg'}
                alt={place.name}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg'
                }}
              />
              {/* 거리 표시 */}
              {place.distance && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {place.distance}
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h4 className="font-medium text-sm mb-1 line-clamp-2">{place.name}</h4>
              <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                {place.youtuberName || place.category}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>⭐ {place.rating || 0}</span>
                <span>{place.tags?.length || 0}명 유튜버</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">
                  {place.viewCount || '조회수 정보 없음'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('❤️ 즐겨찾기 클릭:', place.id)
                    onFavoriteToggle(place.id)
                  }}
                  className={`p-1 rounded-full transition-colors ${
                    place.isFavorite
                      ? 'bg-pink-500 hover:bg-pink-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>

              {/* 버튼들 */}
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('🗺️ 지도 이동 버튼 클릭:', place.name)
                    onPlaceClick(place, index)
                  }}
                  className="flex-1 bg-blue-600 text-white text-xs py-1.5 px-3 rounded hover:bg-blue-700 transition-colors"
                >
                  지도 이동
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('📋 상세 보기 버튼 클릭:', place.name)
                    onPlaceDetail(place)
                  }}
                  className="flex-1 bg-green-600 text-white text-xs py-1.5 px-3 rounded hover:bg-green-700 transition-colors"
                >
                  상세 보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
