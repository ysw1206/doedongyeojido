'use client'

import React from 'react'

interface Place {
  id: string
  name: string
  description?: string
  address?: string
  coordinates: {
    lat: number
    lng: number
  }
  images?: string[]
  category?: string
  rating?: number
  reviewCount?: number
  tags?: string[]
  videoId?: string
}

interface PlaceDetailModalProps {
  place: Place | null
  onClose: () => void
  onGetDirections?: (place: Place) => void
}

export default function PlaceDetailModal({
  place,
  onClose,
  onGetDirections
}: PlaceDetailModalProps) {
  if (!place) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-md max-h-[80vh] rounded-t-xl overflow-hidden animate-slide-up">
        {/* 이미지 영역 */}
        <div className="relative">
          <img
            src={place.images?.[0] || '/placeholder-image.jpg'}
            alt={place.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg'
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* 정보 영역 */}
        <div className="p-6 max-h-[calc(80vh-12rem)] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2 text-gray-900">{place.name}</h2>
          
          {place.description && (
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {place.description}
            </p>
          )}
          
          <div className="space-y-3 mb-6">
            {place.address && (
              <div className="flex items-start text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span className="break-words">{place.address}</span>
              </div>
            )}
            
            {(place.rating || place.reviewCount) && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span>
                  평점 {place.rating || 0}
                  {place.reviewCount && ` (${place.reviewCount}개 리뷰)`}
                </span>
              </div>
            )}
            
            {place.tags && place.tags.length > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
                <span>{place.tags.length}명의 유튜버가 방문</span>
              </div>
            )}

            {place.category && (
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                </svg>
                <span>{place.category}</span>
              </div>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex space-x-3">
            {place.videoId && (
              <button
                onClick={() => {
                  window.open(`https://youtube.com/watch?v=${place.videoId}`, '_blank')
                }}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                영상 보기
              </button>
            )}
            
            <button
              onClick={() => {
                if (onGetDirections) {
                  onGetDirections(place)
                }
              }}
              className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
              경로 안내
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
