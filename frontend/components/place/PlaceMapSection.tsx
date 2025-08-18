'use client'

import React, { useRef, useEffect, useState } from 'react'

interface Highlight {
  id: string
  name: string
  location: string
  address: string
  timestamp: string
  lat: number
  lng: number
  visited: boolean
  phone?: string
}

interface PlaceMapSectionProps {
  address: string
  lat: number
  lng: number
  highlights: Highlight[]
  isKakaoLoaded: boolean
  onHighlightMapClick: (highlight: Highlight) => void
  onCopyAddress: () => void
}

export default function PlaceMapSection({
  address,
  lat,
  lng,
  highlights,
  isKakaoLoaded,
  onHighlightMapClick,
  onCopyAddress
}: PlaceMapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)

  // 지도 초기화
  useEffect(() => {
    if (!isKakaoLoaded || !mapRef.current || typeof window === 'undefined') {
      return
    }

    if (!window.kakao || !window.kakao.maps) {
      return
    }

    try {
      const bounds = new window.kakao.maps.LatLngBounds()
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3
      }
      const mapInstance = new window.kakao.maps.Map(mapRef.current, options)

      highlights.forEach((highlight) => {
        const markerPosition = new window.kakao.maps.LatLng(highlight.lat, highlight.lng)
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        })
        marker.setMap(mapInstance)
        bounds.extend(markerPosition)

        window.kakao.maps.event.addListener(marker, 'click', () => {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${highlight.name} <br/><a href="https://map.kakao.com/link/to/${highlight.name},${highlight.lat},${highlight.lng}" target="_blank">길찾기</a></div>`
          })
          infowindow.open(mapInstance, marker)

          mapInstance.setCenter(markerPosition)
          mapInstance.setLevel(3)
        })
      })

      mapInstance.setBounds(bounds)
      setMap(mapInstance)
    } catch (error) {
      console.error('지도 초기화 중 오류:', error)
    }
  }, [isKakaoLoaded, lat, lng, highlights])

  return (
    <>
      {/* 지도 */}
      <div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="relative h-48 bg-gray-700 rounded-lg mb-3">
            {isKakaoLoaded ? (
              <div ref={mapRef} className="w-full h-full rounded-lg" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p>지도 로딩 중...</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">{address}</span>
            <button 
              onClick={onCopyAddress}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              복사 📋
            </button>
          </div>
        </div>
      </div>

      {/* 방문한 맛집 목록 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-3">방문한 맛집</h3>
        <ul className="space-y-2">
          {highlights.map((highlight) => (
            <li
              key={highlight.id}
              className="bg-gray-800 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              {/* 맛집 이름 */}
              <div>
                <span className="text-white font-medium">{highlight.name}</span>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {/* 찜하기 */}
                <button
                  className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded transition-colors"
                  onClick={() => {
                    // TODO: 실제 찜하기 로직 구현
                    alert('찜하기 기능은 준비 중입니다.')
                  }}
                >
                  찜하기
                </button>

                {/* 지도 */}
                <button
                  className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded transition-colors"
                  onClick={() => onHighlightMapClick(highlight)}
                >
                  지도
                </button>

                {/* 예약 */}
                <button
                  className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded transition-colors"
                  onClick={() => {
                    alert(`'${highlight.name}' 예약 페이지로 이동합니다. (준비 중)`)
                  }}
                >
                  예약
                </button>

                {/* 전화걸기 */}
                {highlight.phone && (
                  <a
                    href={`tel:${highlight.phone}`}
                    className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded transition-colors"
                  >
                    전화걸기
                  </a>
                )}

                {/* 길찾기 */}
                <a
                  href={`https://map.kakao.com/link/to/${highlight.name},${highlight.lat},${highlight.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded transition-colors"
                >
                  길찾기
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
