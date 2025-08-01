import React, { useState } from 'react';

interface SearchSectionProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onVoiceSearch?: () => void;
}

export default function SearchSection({ 
  placeholder = "맛집, 메뉴, 유튜버 검색",
  onSearch,
  onVoiceSearch 
}: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div id="searchSection" className="px-6 py-4 bg-black border-b border-gray-800">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-full text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-pink-500" 
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button 
          type="button"
          onClick={onVoiceSearch}
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
} 