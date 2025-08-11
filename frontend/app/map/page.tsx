'use client'

export default function MapPage() {
  return (
    <div className="h-screen bg-black">
      <div className="relative h-full">
        {/* 지도 영역 (추후 카카오맵 등 연동) */}
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              지도 기능 준비중
            </h2>
            <p className="text-gray-400">
              카카오맵 연동 예정입니다
            </p>
          </div>
        </div>

        {/* 지도 위 검색 바 */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="지도에서 맛집 검색..."
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" 
              />
              <button className="p-2 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 내 위치 버튼 */}
        <div className="absolute bottom-20 right-4 z-10">
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}