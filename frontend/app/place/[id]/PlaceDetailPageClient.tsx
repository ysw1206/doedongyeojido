'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { usePlace } from '@/hooks/usePlaces'
import PlaceVideoSection from '@/components/place/PlaceVideoSection'
import PlaceInfoSection from '@/components/place/PlaceInfoSection'
import PlaceMapSection from '@/components/place/PlaceMapSection'
import PlaceYoutubersSection from '@/components/place/PlaceYoutubersSection'

const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || 'b0b54392c8c4be75d2000792a7f3c58e'

interface Props {
  params: { id: string }
}

export default function PlaceDetailPageClient({ params }: Props) {
  // 모든 훅을 컴포넌트 최상단에 선언
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [visited, setVisited] = useLocalStorage<string[]>('visited', [])
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)

  // API 호출
  const { place, error, isLoading } = usePlace(params.id)

  const isFavorited = favorites.includes(params.id)
  const isVisited = visited.includes(params.id)

  // 카카오맵 API 로드 - 모든 훅을 상단에 배치
  useEffect(() => {
    if (!KAKAO_MAP_API_KEY || typeof window === 'undefined') {
      console.warn('카카오맵 API 키가 설정되지 않았거나 서버 환경입니다.')
      return
    }

    // 이미 카카오맵이 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      console.log('✅ 카카오맵이 이미 로드되어 있습니다.')
      setIsKakaoLoaded(true)
      return
    }

    // 이미 스크립트가 로딩 중인지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]')
    if (existingScript) {
      console.log('카카오맵 스크립트가 이미 로딩 중입니다.')
      
      existingScript.addEventListener('load', () => {
        if (window.kakao && window.kakao.maps) {
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
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`
        script.async = true
        
        script.onload = () => {
          setTimeout(() => {
            if (window.kakao && window.kakao.maps) {
              window.kakao.maps.load(() => {
                console.log('✅ 카카오맵 로딩 성공!')
                resolve()
              })
            } else {
              reject(new Error('카카오맵 객체 없음'))
            }
          }, 100)
        }
        
        script.onerror = (error) => {
          console.error('❌ 카카오맵 스크립트 로드 실패:', error)
          reject(new Error('스크립트 로드 실패'))
        }
        
        document.head.appendChild(script)
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

  // 이벤트 핸들러들
  const handleTimestampClick = (timestamp: string) => {
    const videoElement = document.querySelector('iframe')
    if (videoElement) {
      const [minutes, seconds] = timestamp.split(':').map(Number)
      const timeInSeconds = minutes * 60 + seconds
      videoElement.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [timeInSeconds, true]
      }), '*')
    }
  }

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav !== params.id))
    } else {
      setFavorites([...favorites, params.id])
    }
  }

  const toggleVisited = () => {
    if (isVisited) {
      setVisited(visited.filter(visit => visit !== params.id))
    } else {
      setVisited([...visited, params.id])
    }
  }

  const handleHighlightMapClick = (highlight: any) => {
    console.log('하이라이트 클릭:', highlight)
  }

  const copyAddress = async () => {
    try {
      if (place?.address) {
        await navigator.clipboard.writeText(place.address)
        alert('주소가 복사되었습니다!')
      }
    } catch (err) {
      console.error('주소 복사 실패:', err)
    }
  }

  // 로딩 상태 처리 - 모든 훅 호출 후에 배치
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p>맛집 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태 처리 - 모든 훅 호출 후에 배치
  if (error || !place) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">맛집 정보를 불러오는데 실패했습니다.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 브레드크럼 */}
      <div className="px-6 py-3 border-b border-gray-800">
        <nav className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">홈</Link>
          <span className="mx-2">&gt;</span>
          <Link href="#" className="hover:text-white">{place.category}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-white line-clamp-1">{place.title}</span>
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-col lg:flex-row">
        {/* 왼쪽 영상 섹션 */}
        <PlaceVideoSection
          videoId={place.videoId}
          duration={place.duration}
          youtuberName={place.youtuberName}
          highlights={place.highlights || []}
          onTimestampClick={handleTimestampClick}
        />

        {/* 오른쪽 정보 영역 */}
        <div className="w-full lg:w-1/2">
          <div className="p-6 space-y-6">
            {/* 맛집 정보 섹션 */}
            <PlaceInfoSection
              place={place}
              isFavorited={isFavorited}
              isVisited={isVisited}
              onToggleFavorite={toggleFavorite}
              onToggleVisited={toggleVisited}
            />

            {/* 지도 섹션 */}
            <PlaceMapSection
              address={place.address}
              lat={place.lat}
              lng={place.lng}
              highlights={place.highlights || []}
              isKakaoLoaded={isKakaoLoaded}
              onHighlightMapClick={handleHighlightMapClick}
              onCopyAddress={copyAddress}
            />
          </div>
        </div>
      </main>

      {/* 유튜버 및 관련 맛집 섹션 */}
      <PlaceYoutubersSection
        youtubers={place.youtubers || []}
        relatedPlaces={place.relatedPlaces || []}
      />
    </div>
  )
}