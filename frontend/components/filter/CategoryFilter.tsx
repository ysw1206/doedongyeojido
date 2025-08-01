import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: '전체' },
  { id: 'korean', name: '한식' },
  { id: 'chinese', name: '중식' },
  { id: 'japanese', name: '일식' },
  { id: 'western', name: '양식' },
  { id: 'dessert', name: '디저트' },
  { id: 'cafe', name: '카페' },
  { id: 'bar', name: '술집' },
  { id: 'gangnam', name: '강남' },
  { id: 'hongdae', name: '홍대' },
  { id: 'sinchon', name: '신촌' }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div>
      {/* 모바일: 그리드 레이아웃 */}
      <div className="md:hidden grid grid-cols-4 gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-2 py-1 text-xs rounded-full transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white font-medium shadow-sm'
                : 'bg-gray-800 text-white hover:bg-pink-600 hover:shadow-md'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 데스크톱: 가로 스크롤 */}
      <div className="hidden md:flex gap-2 whitespace-nowrap overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-1 text-sm rounded-full transition-all duration-200 flex-shrink-0 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white font-medium shadow-sm'
                : 'bg-gray-800 text-white hover:bg-pink-600 hover:shadow-md'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
} 