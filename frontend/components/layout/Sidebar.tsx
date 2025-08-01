import React, { useState } from 'react';

interface SidebarProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedYoutuberCounts: string[];
  onYoutuberCountChange: (count: string) => void;
}

export default function Sidebar({ 
  selectedLocation, 
  onLocationChange, 
  selectedYoutuberCounts, 
  onYoutuberCountChange 
}: SidebarProps) {
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
    <aside className="w-64 bg-black border-r border-gray-800 p-6 hidden xl:block">
      <div className="space-y-6">
        {/* 위치 필터 */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">지역</h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <label key={location.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="radio" 
                  name="location" 
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
    </aside>
  );
} 