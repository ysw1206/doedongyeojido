'use client'

import React, { useEffect, useRef, useCallback } from 'react'

interface Place {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  isFavorite?: boolean
  images?: string[]
  category?: string
  rating?: number
  tags?: string[]
}

interface Position {
  lat: number
  lng: number
}

interface MapContainerProps {
  pos: Position | null
  places: Place[]
  selectedPlace: Place | null
  selectedPlaceIndex: number
  isKakaoLoaded: boolean
  onMapReady: (map: any) => void
  onMarkerClick: (place: Place, index: number) => void
  showVideoSlider: boolean
}

declare global {
  interface Window {
    kakao: any
  }
}

export default function MapContainer({
  pos,
  places,
  selectedPlace,
  selectedPlaceIndex,
  isKakaoLoaded,
  onMapReady,
  onMarkerClick,
  showVideoSlider
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const clustererRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // 지도 초기화
  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록 추가 체크
    if (typeof window === 'undefined') {
      console.log('❌ 서버 사이드에서 실행됨 - 스킵')
      return
    }

    console.log('🔍 지도 초기화 조건 체크:', {
      pos: !!pos,
      mapRefCurrent: !!mapRef.current,
      isKakaoLoaded,
      windowKakao: !!(window as any).kakao
    })

    if (!pos || !mapRef.current || !isKakaoLoaded) {
      console.log('❌ 지도 초기화 조건 미충족:', { 
        pos: !!pos, 
        mapRef: !!mapRef.current, 
        isKakaoLoaded 
      })
      return
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
      console.log('❌ 카카오맵 API 객체가 준비되지 않았습니다.')
      return
    }

    // 이미 지도가 초기화되어 있으면 중복 초기화 방지
    if (mapInstanceRef.current) {
      console.log('✅ 지도가 이미 초기화되어 있습니다.')
      return
    }

    console.log('🚀 지도 초기화 시작', { pos })

    try {
      // LatLng 생성 테스트
      const centerLatLng = new window.kakao.maps.LatLng(pos.lat, pos.lng)
      console.log('LatLng 생성 성공:', centerLatLng)

      const options = {
        center: centerLatLng,
        level: 3 // 레벨 3 (약 500m 반경)
      }

      const mapInstance = new window.kakao.maps.Map(mapRef.current, options)
      console.log('지도 인스턴스 생성됨:', mapInstance)
      
      // 줌 레벨 변경 이벤트 등록
      window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', () => {
        const level = mapInstance.getLevel()
        console.log('줌 레벨 변경:', level)
      })

      // 클러스터러 초기화 (MarkerClusterer가 있는 경우만)
      let clustererInstance = null
      if (window.kakao.maps.MarkerClusterer) {
        clustererInstance = new window.kakao.maps.MarkerClusterer({
          map: mapInstance,
          averageCenter: true,
          minLevel: 6, // 레벨 6 이상에서 클러스터링
          disableClickZoom: true,
          calculator: [10, 30, 50], // 클러스터 단계
          styles: [
            {
              width: '30px',
              height: '30px',
              background: 'rgba(236, 72, 153, 0.8)',
              borderRadius: '15px',
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              lineHeight: '30px'
            },
            {
              width: '40px',
              height: '40px',
              background: 'rgba(236, 72, 153, 0.8)',
              borderRadius: '20px',
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              lineHeight: '40px'
            },
            {
              width: '50px',
              height: '50px',
              background: 'rgba(236, 72, 153, 0.8)',
              borderRadius: '25px',
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              lineHeight: '50px'
            }
          ]
        })
        console.log('클러스터러 생성됨:', clustererInstance)
      } else {
        console.warn('MarkerClusterer를 사용할 수 없습니다. 기본 마커만 사용합니다.')
      }

      mapInstanceRef.current = mapInstance
      clustererRef.current = clustererInstance
      onMapReady(mapInstance)
      
    } catch (error) {
      console.error('지도 초기화 중 오류:', error)
    }
  }, [pos, isKakaoLoaded]) // onMapReady 제거

  // 마커 생성
  useEffect(() => {
    const map = mapInstanceRef.current
    const clusterer = clustererRef.current
    
    if (!map || typeof window === 'undefined' || !window.kakao) return

    // 기존 마커 제거
    if (clusterer) {
      clusterer.clear()
    } else {
      // 클러스터러가 없는 경우 개별 마커 제거
      markersRef.current.forEach(marker => marker.setMap(null))
    }

    const newMarkers: any[] = []

    places.forEach((place, index) => {
      if (!place.coordinates) return

      const markerPosition = new window.kakao.maps.LatLng(place.coordinates.lat, place.coordinates.lng)
      
      // 마커 이미지 생성
      const imageSrc = place.isFavorite 
        ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#ec4899"/>
            <path d="M16 24.35l-1.45-1.32C9.4 18.36 6 15.28 6 11.5 6 8.42 8.42 6 11.5 6c1.74 0 3.41.81 4.5 2.09C17.59 6.81 19.26 6 21 6c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L16 24.35z" fill="white"/>
          </svg>
        `)
        : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#6b7280"/>
            <path d="M16 24.35l-1.45-1.32C9.4 18.36 6 15.28 6 11.5 6 8.42 8.42 6 11.5 6c1.74 0 3.41.81 4.5 2.09C17.59 6.81 19.26 6 21 6c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L16 24.35z" fill="white"/>
          </svg>
        `)
      
      const imageSize = new window.kakao.maps.Size(32, 32)
      const imageOption = { offset: new window.kakao.maps.Point(16, 16) }
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
        title: place.name
      })

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerClick(place, index)
      })

      newMarkers.push(marker)
    })

    // 클러스터러가 있으면 클러스터러에 추가, 없으면 개별 마커로 지도에 추가
    if (clusterer) {
      clusterer.addMarkers(newMarkers)
    } else {
      newMarkers.forEach(marker => marker.setMap(map))
    }
    
    markersRef.current = newMarkers
  }, [places]) // onMarkerClick 제거

  console.log('지도 초기화 조건 미충족:', { pos, mapRef: mapRef.current, isKakaoLoaded })

  return (
    <div className="relative flex-1">
      <div
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 줌 컨트롤 */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden z-20">
        <button
          onClick={() => {
            const map = mapInstanceRef.current
            if (map) {
              const level = map.getLevel()
              map.setLevel(level - 1)
            }
          }}
          className="block w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 border-b border-gray-200"
        >
          +
        </button>
        <button
          onClick={() => {
            const map = mapInstanceRef.current
            if (map) {
              const level = map.getLevel()
              map.setLevel(level + 1)
            }
          }}
          className="block w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100"
        >
          −
        </button>
      </div>

      {/* 현재 위치 버튼 */}
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const newPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
              // 지도 중심 이동
              const map = mapInstanceRef.current
              if (map && typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
                const moveLatLng = new window.kakao.maps.LatLng(newPos.lat, newPos.lng)
                map.panTo(moveLatLng)
              }
            })
          }
        }}
        className="absolute bottom-32 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 z-20"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  )
}
