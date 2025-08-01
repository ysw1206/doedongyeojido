import React, { useState } from 'react';

interface ShortsCard {
  id: string;
  title: string;
  image: string;
  duration: string;
  viewCount: string;
  videoId: string;
}

interface ShortsSectionProps {
  shorts: ShortsCard[];
}

export default function ShortsSection({ shorts }: ShortsSectionProps) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>Shorts</span>
        </h2>
        <div className="relative">
          <button 
            onClick={toggleOptionsMenu}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
          
          {/* 숏츠 옵션 메뉴 */}
          {showOptionsMenu && (
            <div className="absolute right-0 top-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700 min-w-48 z-50">
              <div className="py-1">
                <button className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-3 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span>Show fewer Shorts</span>
                </button>
                <button className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-3 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  <span>Not interested</span>
                </button>
                <button className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-3 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span>Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 숏츠 카드 그리드 */}
      {/* 모바일에서 2개만 보이도록 컨테이너 */}
      <div className="md:hidden flex gap-3">
        {shorts.slice(0, 2).map((short) => (
          <div key={short.id} className="cursor-pointer group flex-1">
            <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-2">
              <img src={short.image} alt={short.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white text-xs font-medium line-clamp-2">{short.title}</div>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                {short.duration}
              </div>
            </div>
            <div className="text-xs text-gray-400">{short.viewCount}</div>
          </div>
        ))}
      </div>

      {/* 데스크톱용 숏츠 카드 그리드 */}
      <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {shorts.map((short) => (
          <div key={short.id} className="cursor-pointer group">
            <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-2">
              <img src={short.image} alt={short.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white text-xs font-medium line-clamp-2">{short.title}</div>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                {short.duration}
              </div>
            </div>
            <div className="text-xs text-gray-400">{short.viewCount}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 