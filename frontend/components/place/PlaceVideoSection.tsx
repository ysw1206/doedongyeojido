'use client'

import React from 'react'

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

interface PlaceVideoSectionProps {
  videoId: string
  duration: string
  youtuberName: string
  highlights: Highlight[]
  onTimestampClick: (timestamp: string) => void
}

export default function PlaceVideoSection({
  videoId,
  duration,
  youtuberName,
  highlights,
  onTimestampClick
}: PlaceVideoSectionProps) {
  return (
    <div className="w-full lg:w-1/2 lg:sticky lg:top-16 lg:h-screen">
      <div className="p-6">
        <div className="relative">
          {/* 유튜브 영상 임베드 */}
          <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
              className="w-full h-full"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded">
            {duration}
          </div>
        </div>
        
        {/* 유튜버 정보 */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">김</span>
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">{youtuberName}</div>
              <div className="text-sm text-gray-400">구독자 45.2만명</div>
            </div>
            <button className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200">
              구독
            </button>
          </div>
        </div>

        {/* 영상 하이라이트 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">영상 하이라이트</h3>
          <ul className="space-y-2">
            {highlights.map((highlight) => (
              <li key={highlight.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                <div>
                  <div className="text-white font-medium">{highlight.name}</div>
                  <div className="text-sm text-gray-400">{highlight.location} - {highlight.address}</div>
                </div>
                <button 
                  className="text-pink-400 hover:text-pink-300 text-sm transition-colors"
                  onClick={() => onTimestampClick(highlight.timestamp)}
                >
                  {highlight.timestamp}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
