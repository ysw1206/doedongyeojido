import React, { useEffect } from 'react';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedYoutuberCounts: string[];
  onYoutuberCountChange: (count: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export default function MobileFilterModal({
  isOpen,
  onClose,
  selectedLocation,
  onLocationChange,
  selectedYoutuberCounts,
  onYoutuberCountChange,
  onClearFilters,
  onApplyFilters
}: MobileFilterModalProps) {
  // 모달이 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const locations = [
    { id: 'gangnam', name: '강남구', selected: selectedLocation === 'gangnam' },
    { id: 'mapo', name: '마포구', selected: selectedLocation === 'mapo' },
    { id: 'seodaemun', name: '서대문구', selected: selectedLocation === 'seodaemun' },
    { id: 'jongno', name: '종로구', selected: selectedLocation === 'jongno' }
  ];

  const youtuberCounts = [
    { id: '1', name: '1명 이상', selected: selectedYoutuberCounts.includes('1') },
    { id: '3', name: '3명 이상', selected: selectedYoutuberCounts.includes('3') },
    { id: '5', name: '5명 이상', selected: selectedYoutuberCounts.includes('5') }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute inset-0 flex items-end lg:items-center justify-center">
        <div className="bg-black w-full lg:w-96 h-5/6 lg:h-auto max-h-screen overflow-y-auto rounded-t-lg lg:rounded-lg">
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">맛집 검색 필터</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* 모달 내용 */}
          <div className="p-4 space-y-6">
            {/* 위치 필터 */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">지역</h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <label key={location.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="radio" 
                      name="mobileLocation" 
                      className="accent-pink-400" 
                      checked={location.selected}
                      onChange={() => onLocationChange(location.id)}
                    />
                    <span className={location.selected ? "text-white" : "text-gray-400"}>
                      {location.selected ? "●" : "○"} {location.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 유튜버 방문수 필터 */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">유튜버 방문수</h3>
              <div className="space-y-2">
                {youtuberCounts.map((count) => (
                  <label key={count.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-pink-400" 
                      checked={count.selected}
                      onChange={() => onYoutuberCountChange(count.id)}
                    />
                    <span className="text-gray-300">{count.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 찜 목록 */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">내 찜</h3>
              <div className="text-sm text-gray-400">
                찜한 맛집이 없습니다
              </div>
            </div>
          </div>

          {/* 모달 액션 버튼 */}
          <div className="p-4 border-t border-gray-800 flex gap-3">
            <button 
              onClick={onClearFilters}
              className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              전체 해제
            </button>
            <button 
              onClick={onApplyFilters}
              className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
            >
              필터 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 