'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import CategoryFilter from '@/components/filter/CategoryFilter'
import { useNearbyPlaces } from '@/hooks'

interface Position {
  lat: number
  lng: number
}

// 카카오맵 API 키 (실제 환경에서는 환경변수로 관리)
const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || 'b0b54392c8c4be75d2000792a7f3c58e'

export default function MapPage() {
  const [pos, setPos] = useState<Position | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [distanceFilter, setDistanceFilter] = useState('3km')
  const [youtuberCountFilter, setYoutuberCountFilter] = useState('1')
  const [map, setMap] = useState<any>(null)
  const [clusterer, setClusterer] = useState<any>(null)
  const [zoomLevel, setZoomLevel] = useState(3)
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0)
  const [showVideoSlider, setShowVideoSlider] = useState(true)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])

  // 주변 장소 쿼리 파라미터 생성
  const nearbyQuery = useMemo(() => {
    if (!pos) return undefined;
    
    return {
      lat: pos.lat,
      lng: pos.lng,
      radius: parseFloat(distanceFilter.replace(/[km]/g, '')) * 1000, // km를 m로 변환
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchQuery || undefined,
      youtuberCount: parseInt(youtuberCountFilter),
      limit: 20
    };
  }, [pos, selectedCategory, searchQuery, distanceFilter, youtuberCountFilter]);

  // SWR 훅으로 주변 장소 데이터 가져오기
  const { places: nearbyPlaces, isLoading: placesLoading, error: placesError, refresh } = useNearbyPlaces(nearbyQuery);

  // 필터링된 장소 목록 (클라이언트 사이드 추가 필터링)
  const filteredPlaces = useMemo(() => {
    return nearbyPlaces.filter(place => {
      // 검색 필터 (서버에서 이미 필터링되지만 추가 클라이언트 필터링)
      if (searchQuery && !place.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [nearbyPlaces, searchQuery]);

  // 카카오맵 API 로드
  useEffect(() => {
    console.log('카카오맵 API 키:', KAKAO_MAP_API_KEY ? '설정됨' : '미설정')
    
    if (!KAKAO_MAP_API_KEY) {
      console.warn('카카오맵 API 키가 설정되지 않았습니다.')
      setIsKakaoLoaded(false)
      return
    }

    // 이미 카카오맵이 로드되어 있는지 확인
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      console.log('✅ 카카오맵이 이미 로드되어 있습니다.')
      setIsKakaoLoaded(true)
      return
    }

    // 이미 스크립트가 로딩 중인지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]')
    if (existingScript) {
      console.log('카카오맵 스크립트가 이미 로딩 중입니다.')
      
      // 스크립트 로드 완료 대기
      existingScript.addEventListener('load', () => {
        if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('✅ 기존 스크립트로 카카오맵 로딩 완료!')
            setIsKakaoLoaded(true)
          })
        }
      })
      return
    }

    const loadKakaoMapScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=clusterer`
        
        script.onload = () => {
          console.log('카카오맵 스크립트 로드 완료')
          
          // 잠시 대기 후 kakao 객체 확인
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
              console.log('window.kakao.maps 확인됨')
              
              // maps.load 호출
              window.kakao.maps.load(() => {
                console.log('kakao.maps.load 완료')
                
                // 필요한 객체들 확인
                const checks = {
                  LatLng: !!window.kakao.maps.LatLng,
                  Map: !!window.kakao.maps.Map,
                  Marker: !!window.kakao.maps.Marker,
                  MarkerClusterer: !!window.kakao.maps.MarkerClusterer,
                  event: !!window.kakao.maps.event
                }
                
                console.log('카카오맵 객체 확인:', checks)
                
                if (checks.LatLng && checks.Map && checks.Marker) {
                  console.log('✅ 카카오맵 로딩 성공!')
                  resolve()
                } else {
                  console.error('❌ 필수 카카오맵 객체 누락')
                  reject(new Error('필수 객체 누락'))
                }
              })
            } else {
              console.error('❌ window.kakao.maps 없음')
              reject(new Error('카카오맵 객체 없음'))
            }
          }, 100)
        }
        
        script.onerror = (error) => {
          console.error('❌ 카카오맵 스크립트 로드 실패:', error)
          reject(new Error('스크립트 로드 실패'))
        }
        
        document.head.appendChild(script)
        console.log('카카오맵 스크립트 추가됨')
      })
    }

    loadKakaoMapScript()
      .then(() => {
        setIsKakaoLoaded(true)
      })
      .catch((error) => {
        console.error('카카오맵 로딩 실패:', error)
        setIsKakaoLoaded(false)
      })
  }, [])

  // 현재 위치 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          console.log('위치 정보 성공:', coords.latitude, coords.longitude)
          setPos({ lat: coords.latitude, lng: coords.longitude })
        },
        (error) => {
          console.warn('위치 정보를 가져올 수 없습니다:', error.message)
          console.log('기본 위치(강남역)로 설정합니다.')
          // 기본 위치 (강남역)
          setPos({ lat: 37.498095, lng: 127.027610 })
        },
        options
      )
    } else {
      console.log('Geolocation이 지원되지 않습니다. 기본 위치로 설정합니다.')
      // 기본 위치 (강남역)
      setPos({ lat: 37.498095, lng: 127.027610 })
    }
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (!pos || !mapRef.current || !isKakaoLoaded || typeof window === 'undefined') {
      console.log('지도 초기화 조건 미충족:', { pos, mapRef: mapRef.current, isKakaoLoaded })
      return
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
      console.log('카카오맵 API 객체가 준비되지 않았습니다.')
      return
    }

    console.log('지도 초기화 시작', { pos })

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
        setZoomLevel(level)
        
        // 줌 레벨에 따라 비디오 슬라이더 표시 여부 결정
        setShowVideoSlider(level <= 5) // 레벨 5 이하에서만 비디오 슬라이더 표시
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

      setMap(mapInstance)
      setClusterer(clustererInstance)
      
    } catch (error) {
      console.error('지도 초기화 중 오류:', error)
    }
  }, [pos, isKakaoLoaded])

  // 마커 생성
  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.kakao) return

    // 기존 마커 제거
    if (clusterer) {
      clusterer.clear()
    } else {
      // 클러스터러가 없는 경우 개별 마커 제거
      markersRef.current.forEach(marker => marker.setMap(null))
    }

    const newMarkers: any[] = []

    filteredPlaces.forEach((place, index) => {
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
        setSelectedPlace(place)
        setSelectedPlaceIndex(index)
        
        // 슬라이더를 해당 아이템으로 스크롤
        if (sliderRef.current && showVideoSlider) {
          const itemWidth = 272 // 각 아이템의 너비
          const scrollLeft = index * itemWidth - (sliderRef.current.clientWidth / 2) + (itemWidth / 2)
          sliderRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' })
        }
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
  }, [map, clusterer, filteredPlaces, showVideoSlider])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('검색:', searchQuery)
  }

  const handleVoiceSearch = () => {
    console.log('음성 검색')
  }

  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place)
    // 지도에서 해당 위치로 이동
    if (map && typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      const moveLatLng = new window.kakao.maps.LatLng(place.coordinates.lat, place.coordinates.lng)
      map.panTo(moveLatLng)
      map.setLevel(3)
    }
  }

  const handleClosePlaceDetail = () => {
    setSelectedPlace(null)
  }

  const handleFavoriteToggle = (placeId: string) => {
    console.log('찜 토글:', placeId)
    // 실제로는 API 호출로 상태 업데이트
  }

  const handleGetDirections = (place: any) => {
    const url = `https://map.kakao.com/link/to/${place.name},${place.coordinates.lat},${place.coordinates.lng}`
    window.open(url, '_blank')
  }

  // 슬라이더 스크롤 이벤트 처리
  const handleSliderScroll = () => {
    if (!sliderRef.current || !showVideoSlider) return
    
    const slider = sliderRef.current
    const itemWidth = 272 // 각 아이템의 너비 (w-64 + gap-4)
    const scrollLeft = slider.scrollLeft
    const centerPosition = scrollLeft + (slider.clientWidth / 2)
    const newIndex = Math.round(centerPosition / itemWidth)
    
    if (newIndex !== selectedPlaceIndex && newIndex >= 0 && newIndex < filteredPlaces.length) {
      setSelectedPlaceIndex(newIndex)
      
      // 선택된 장소로 지도 중심 이동
      const selectedPlace = filteredPlaces[newIndex]
      if (map && selectedPlace && typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
        const moveLatLng = new window.kakao.maps.LatLng(selectedPlace.coordinates.lat, selectedPlace.coordinates.lng)
        map.panTo(moveLatLng)
      }
    }
  }

  // 슬라이더 아이템 클릭 핸들러
  const handleSliderItemClick = (place: any, index: number) => {
    setSelectedPlaceIndex(index)
    
    // 지도 중심을 해당 위치로 이동
    if (map && typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      const moveLatLng = new window.kakao.maps.LatLng(place.coordinates.lat, place.coordinates.lng)
      map.panTo(moveLatLng)
    }
    
    // 슬라이더를 해당 아이템으로 스크롤
    if (sliderRef.current) {
      const itemWidth = 272
      const scrollLeft = index * itemWidth - (sliderRef.current.clientWidth / 2) + (itemWidth / 2)
      sliderRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }

  if (!pos) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>위치 정보를 가져오는 중...</p>
        </div>
      </div>
    )
  }

  // 로딩 및 에러 처리
  if (placesError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">주변 맛집 정보를 불러오는 중 오류가 발생했습니다</div>
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

  // 카카오맵이 로드되지 않았을 때 임시 지도 표시
  if (!isKakaoLoaded) {
    return (
      <>
        {/* 검색 및 필터 섹션 */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="px-6 py-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="맛집, 메뉴, 유튜버 검색" 
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

          <div className="px-6 py-3 border-b border-gray-800">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div className="px-6 py-3 flex justify-between items-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span>필터</span>
            </button>
            
            <div className="text-sm text-gray-400">
              {placesLoading ? '로딩 중...' : `${filteredPlaces.length}개의 맛집`}
            </div>
          </div>

          {showFilters && (
            <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">거리</label>
                  <select 
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
                  >
                    <option value="0.5km">500m</option>
                    <option value="1km">1km</option>
                    <option value="3km">3km</option>
                    <option value="5km">5km</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">유튜버 방문수</label>
                  <select 
                    value={youtuberCountFilter}
                    onChange={(e) => setYoutuberCountFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
                  >
                    <option value="1">1명 이상</option>
                    <option value="3">3명 이상</option>
                    <option value="5">5명 이상</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 임시 지도 컨테이너 */}
        <div className="relative w-full h-screen pt-44">
          {/* 임시 지도 영역 */}
          <div className="absolute inset-0 w-full h-full min-h-[500px] bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-white">카카오맵을 로드하는 중...</p>
              <div className="mt-4 text-sm text-gray-400">
                <div>위치: {pos ? '✅' : '❌'}</div>
                <div>카카오맵: {isKakaoLoaded ? '✅' : '❌'}</div>
                <div>API 키: {KAKAO_MAP_API_KEY ? '✅' : '❌'}</div>
                <div>데이터: {placesLoading ? '로딩 중...' : `${filteredPlaces.length}개`}</div>
              </div>
            </div>
          </div>

          {/* 하단 비디오 슬라이더 */}
          {filteredPlaces.length > 0 && ( 
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-95 backdrop-blur-sm border-t border-gray-700 z-10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">주변 맛집 영상</h2>
                  <span className="text-sm text-gray-400">{filteredPlaces.length}개</span>
                </div>
                <div 
                  ref={sliderRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                  style={{ scrollSnapType: 'x mandatory' }}
                  onScroll={handleSliderScroll}
                >
                
                  {filteredPlaces.map((place, index) => (
                    <div 
                      key={place.id}
                      onClick={() => handleSliderItemClick(place, index)}
                      className={`flex-shrink-0 w-64 bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                        index === selectedPlaceIndex 
                          ? 'ring-4 ring-pink-500 shadow-lg shadow-pink-500/50 scale-105' 
                          : 'hover:bg-gray-800'
                      }`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      {/* 부모 div 안에서 이미지 + 하단 정보 두 덩어리 모두 감싸기 */}
                      <div className="relative">
                        <img 
                          src={place.images?.[0] || ''} 
                          alt={place.name}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjg4IiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI4OCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODgiIGhlaWdodD0iMTYwIiBmaWxsPSIjM0Y0QjU5Ii8+CjxwYXRoIGQ9Ik0xNDQgODBDMzIuMzUgODAgMCAxMTIuMzUgMCAxNDRWMTYwSDI4OFYxNDRDMjg4IDExMi4zNSAyNTUuNjUgODAgMTQ0IDgwWiIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMTA4IDEyMEMyOS4wOSAxMjAgMCAxNDkuMDkgMCAxNjhWMTkySDI4OFYxNjhDMjg4IDE0OS4wOSAyNTguOTEgMTIwIDIzMCAxMjBIMTA4WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K'
                          }}
                        />

                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {place.distance}
                        </div>
                      </div>

                      {/* 아래 정보영역 */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-white mb-1 truncate">{place.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">{place.youtuberName}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{place.viewCount}</span>
                          <span>•</span>
                          <span>{place.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gradient-to-r from-pink-400 to-pink-500 text-white px-2 py-1 rounded">
                            유튜버 {place.youtuberCount}명 방문
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFavoriteToggle(place.id)
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              place.isFavorite 
                                ? 'bg-gradient-to-r from-pink-400 to-pink-500' 
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}       

                </div>
              </div>
            </div>
          )}          
        </div>
      </>
    )
  }

  if (!KAKAO_MAP_API_KEY) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">카카오맵 API 키가 필요합니다</h2>
          <p className="text-gray-400 mb-4">지도 기능을 사용하려면 카카오맵 API 키를 설정해주세요.</p>
          <div className="bg-gray-800 p-4 rounded-lg text-sm">
            <p className="mb-2">1. <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code> 파일을 생성하세요</p>
            <p className="mb-2">2. 다음 내용을 추가하세요:</p>
            <code className="bg-gray-700 px-2 py-1 rounded block">NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_api_key_here</code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 상단 검색 및 필터 영역 */}
      <div className="bg-black text-white p-4 border-b border-gray-800">
        {/* 검색 입력 */}
        <div className="flex items-center mb-4 bg-gray-800 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="맛집, 카페, 술집 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none"
          />
          <button
            onClick={() => refresh()}
            className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>

        {/* 카테고리 필터 */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* 추가 필터 토글 버튼 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3 text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
          상세 필터 {showFilters ? '숨기기' : '보기'}
        </button>

        {/* 상세 필터 패널 */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">거리</label>
              <select
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1km">1km 이내</option>
                <option value="3km">3km 이내</option>
                <option value="5km">5km 이내</option>
                <option value="10km">10km 이내</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">유튜버 수</label>
              <select
                value={youtuberCountFilter}
                onChange={(e) => setYoutuberCountFilter(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1명 이상</option>
                <option value="2">2명 이상</option>
                <option value="3">3명 이상</option>
                <option value="5">5명 이상</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 지도 영역 */}
      <div className="relative flex-1">
        <div
          ref={mapRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* 로딩 오버레이 */}
        {(!isKakaoLoaded || placesLoading) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>{!isKakaoLoaded ? '지도를 불러오는 중...' : '맛집을 찾는 중...'}</p>
            </div>
          </div>
        )}

        {/* 에러 오버레이 */}
        {placesError && (
          <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg z-20">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              <span>데이터를 불러오는 중 오류가 발생했습니다.</span>
              <button
                onClick={() => refresh()}
                className="ml-auto underline hover:no-underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 줌 컨트롤 */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden z-20">
          <button
            onClick={() => {
              if (map) {
                const level = map.getLevel()
                map.setLevel(level - 1)
                setZoomLevel(level - 1)
              }
            }}
            className="block w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 border-b border-gray-200"
          >
            +
          </button>
          <button
            onClick={() => {
              if (map) {
                const level = map.getLevel()
                map.setLevel(level + 1)
                setZoomLevel(level + 1)
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
                setPos(newPos)
                if (map) {
                  const moveLatLon = new kakao.maps.LatLng(newPos.lat, newPos.lng)
                  map.setCenter(moveLatLon)
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

      {/* 하단 상점 목록 슬라이더 */}
      {showVideoSlider && nearbyPlaces && nearbyPlaces.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 text-white p-4 z-30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">주변 맛집 ({nearbyPlaces.length})</h3>
            <button
              onClick={() => setShowVideoSlider(false)}
              className="text-gray-400 hover:text-white"
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
          >
            {nearbyPlaces.map((place, index) => (
              <div
                key={place.id}
                onClick={() => {
                  setSelectedPlace(place)
                  setSelectedPlaceIndex(index)
                  if (map && place.coordinates) {
                    const moveLatLon = new kakao.maps.LatLng(place.coordinates.lat, place.coordinates.lng)
                    map.setCenter(moveLatLon)
                  }
                }}
                className={`flex-shrink-0 w-72 bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedPlace?.id === place.id 
                    ? 'ring-2 ring-blue-400 border-2 border-blue-400' 
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
                  {/* 플레이 버튼 오버레이 제거됨 */}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{place.name}</h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">{place.category}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>⭐ {place.rating}</span>
                    <span>{place.tags?.length || 0}명 유튜버</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{place.distance || '거리 정보 없음'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // 즐겨찾기 토글 로직
                      }}
                      className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 장소 상세 정보 모달 */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md max-h-[80vh] rounded-t-xl overflow-hidden">
            <div className="relative">
              <img
                src={selectedPlace.images?.[0] || '/placeholder-image.jpg'}
                alt={selectedPlace.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg'
                }}
              />
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{selectedPlace.name}</h2>
              <p className="text-gray-600 mb-4">{selectedPlace.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  {selectedPlace.address}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  평점 {selectedPlace.rating} ({selectedPlace.reviewCount}개 리뷰)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                  {selectedPlace.tags?.length || 0}명의 유튜버가 방문
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (selectedPlace.videoId) {
                      window.open(`https://youtube.com/watch?v=${selectedPlace.videoId}`, '_blank')
                    }
                  }}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-all"
                >
                  영상 보기
                </button>
                <button
                  onClick={() => {
                    // 경로 안내 로직
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-500 hover:to-blue-600 transition-all"
                >
                  경로 안내
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}