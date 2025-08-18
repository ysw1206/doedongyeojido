'use client'

import React from 'react'

interface PlaceData {
  id: string
  title: string
  description: string
  category: string
  youtuberCount: number
  viewCount: string
  uploadTime: string
  location: string
  address: string
  phone: string
  hours: string
  reservation: string
  price: string
  parking: string
  atmosphere: string
  mainMenu: string
  features: string[]
  likes: string
  comments: string
}

interface PlaceInfoSectionProps {
  place: PlaceData
  isFavorited: boolean
  isVisited: boolean
  onToggleFavorite: () => void
  onToggleVisited: () => void
}

export default function PlaceInfoSection({
  place,
  isFavorited,
  isVisited,
  onToggleFavorite,
  onToggleVisited
}: PlaceInfoSectionProps) {
  return (
    <div className="space-y-6">
      {/* 맛집 제목 및 상태 */}
      <div>
        <div className="inline-block bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs px-2 py-1 rounded mb-2">
          유튜버 {place.youtuberCount}명 방문
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{place.title}</h1>
        <p className="text-sm text-gray-400">{place.uploadTime} 업로드</p>
      </div>

      {/* 주요 정보 바 */}
      <div className="flex bg-gray-800 rounded-lg p-4">
        <div className="flex-1 text-center border-r border-gray-600">
          <div className="text-2xl font-bold text-white">{place.viewCount}</div>
          <div className="text-xs text-gray-400">조회수</div>
        </div>
        <div className="flex-1 text-center border-r border-gray-600">
          <div className="text-lg font-semibold text-white">{place.category}</div>
          <div className="text-xs text-gray-400">카테고리</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-lg font-semibold text-white">{place.location}</div>
          <div className="text-xs text-gray-400">지역</div>
        </div>
      </div>

      {/* 맛집 정보 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">맛집 정보</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">매장명</span>
            <span className="text-white">강남 숨겨진 맛집 모음</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">주소</span>
            <span className="text-white">{place.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">전화번호</span>
            <span className="text-white">{place.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">영업시간</span>
            <span className="text-white">{place.hours}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">예약가능</span>
            <span className="text-green-400">{place.reservation}</span>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">상세 정보</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">평균 가격</span>
            <span className="text-white">{place.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">주차</span>
            <span className="text-white">{place.parking}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">분위기</span>
            <span className="text-white">{place.atmosphere}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">대표메뉴</span>
            <span className="text-white">{place.mainMenu}</span>
          </div>
        </div>
      </div>

      {/* 특징 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">특징</h2>
        <div className="flex gap-2 flex-wrap">
          {place.features.map((feature, index) => (
            <span key={index} className="bg-gray-700 text-white text-sm px-3 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* 상세 내용 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">유튜버 후기</h2>
        <div className="text-sm text-white leading-relaxed whitespace-pre-line">
          {place.description}
        </div>
      </div>

      {/* 활동 정보 */}
      <div>
        <div className="text-sm text-gray-400">
          조회수 {place.viewCount}회 • 좋아요 {place.likes} • 댓글 {place.comments}개
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3 pt-4">
        <button 
          onClick={onToggleFavorite}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isFavorited 
              ? 'bg-pink-500 text-white hover:bg-pink-600' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isFavorited ? '❤️ 찜 해제' : '🤍 찜하기'}
        </button>
        <div className="flex gap-3">
          <a 
            href={`https://map.kakao.com/link/to/${place.title},${place.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            📍 길찾기
          </a>
          <a 
            href={`tel:${place.phone}`}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
          >
            📞 전화걸기
          </a>
        </div>
        <button 
          onClick={onToggleVisited}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isVisited 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isVisited ? '✅ 방문 완료' : '📍 방문 표시'}
        </button>
      </div>
    </div>
  )
}
