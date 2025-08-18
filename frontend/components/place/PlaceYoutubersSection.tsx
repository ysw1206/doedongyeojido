'use client'

import React from 'react'
import Link from 'next/link'

interface Youtuber {
  id: string
  name: string
  subscribers: string
  avatar: string
  color: string
  review: string
  visitTime: string
}

interface RelatedPlace {
  id: string
  title: string
  youtuberName: string
  viewCount: string
  uploadTime: string
  duration: string
  category: string
  youtuberCount: number
  image: string
}

interface PlaceYoutubersSectionProps {
  youtubers: Youtuber[]
  relatedPlaces: RelatedPlace[]
}

export default function PlaceYoutubersSection({
  youtubers,
  relatedPlaces
}: PlaceYoutubersSectionProps) {
  return (
    <>
      {/* 유튜버 방문 기록 */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">방문한 유튜버들</h2>
          <Link href="#" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">더 보기 &gt;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {youtubers.map((youtuber) => (
            <div key={youtuber.id} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${youtuber.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">{youtuber.avatar}</span>
                </div>
                <div>
                  <div className="text-white font-medium">{youtuber.name}</div>
                  <div className="text-xs text-gray-400">구독자 {youtuber.subscribers}</div>
                </div>
              </div>
              <div className="text-sm text-gray-300 mb-2">{youtuber.review}</div>
              <div className="text-xs text-gray-500">{youtuber.visitTime} 방문</div>
            </div>
          ))}
        </div>
      </section>

      {/* 관련 맛집 추천 */}
      <section className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">이런 맛집도 있어요</h1>
          <Link href="#" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">더 구경하기 &gt;</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedPlaces.map((place) => (
            <Link key={place.id} href={`/place/${place.id}`} className="block">
              <div className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="relative">
                  <img 
                    src={place.image} 
                    alt="맛집" 
                    className="w-full aspect-video object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjM0Y0QjU5Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMzUuMzQ3IDkwIDAgMTI1LjM0NyAwIDE2MFYxODBIMzIwVjE2MEMzMjAgMTI1LjM0NyAyODQuNjUzIDkwIDE2MCA5MFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+'
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                    {place.duration}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">{place.title}</h3>
                  <p className="text-xs text-gray-400 mb-1">{place.youtuberName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>조회수 {place.viewCount}</span>
                    <span>•</span>
                    <span>{place.uploadTime}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs bg-gradient-to-r from-pink-400 to-pink-500 text-white px-2 py-0.5 rounded">유튜버 {place.youtuberCount}명 방문</span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{place.category}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
