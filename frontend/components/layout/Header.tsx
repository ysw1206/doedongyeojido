'use client'


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  onLocationClick: () => void;
  onMapToggle: () => void;
  isMapMode: boolean;
  showSearchSection?: boolean;
}

export default function Header({ onLocationClick, onMapToggle, isMapMode, showSearchSection = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isHeaderSearchVisible, setIsHeaderSearchVisible] = useState(false);
  const [isLocationPopupVisible, setIsLocationPopupVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('강남구');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentTheme } = useTheme();

  // 모바일 메뉴가 열릴 때 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      sessionStorage.setItem('scrollPosition', scrollY.toString());
    } else {
      const scrollY = sessionStorage.getItem('scrollPosition');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        sessionStorage.removeItem('scrollPosition');
      }
    }

    // 컴포넌트 언마운트 시 스타일 복원
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    if (!showSearchSection) return; // 검색 섹션이 없으면 스크롤 이벤트 무시

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const searchSection = document.getElementById('searchSection');
      
      if (searchSection) {
        // 헤더가 고정되어 있으므로 헤더 높이(64px)를 고려하여 계산
        const headerHeight = 64; // px-6 py-4 = 24px + 16px = 40px + 여유분
        const searchSectionBottom = searchSection.offsetTop + searchSection.offsetHeight - headerHeight;
        
        // 디버깅용 로그
        console.log('Scroll Top:', scrollTop, 'Search Section Bottom:', searchSectionBottom, 'Header Height:', headerHeight);
        
        if (scrollTop > searchSectionBottom) {
          console.log('Showing header search button');
          setIsHeaderSearchVisible(true);
        } else {
          console.log('Hiding header search button');
          setIsHeaderSearchVisible(false);
        }
      } else {
        console.log('Search section not found');
      }
    };

    // 초기 로드 시에도 체크
    setTimeout(handleScroll, 100); // DOM이 완전히 로드된 후 체크
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showSearchSection]);

  // ESC 키로 플로팅 검색 및 위치 팝업 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSearchVisible) {
          setIsSearchVisible(false);
        }
        if (isLocationPopupVisible) {
          setIsLocationPopupVisible(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchVisible, isLocationPopupVisible]);

  const showFloatingSearch = () => {
    setIsSearchVisible(true);
    // 검색 입력 필드에 포커스
    setTimeout(() => {
      const searchInput = document.getElementById('floatingSearchInput') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 300);
  };

  const hideFloatingSearch = () => {
    setIsSearchVisible(false);
  };

  const toggleLocationPopup = () => {
    setIsLocationPopupVisible(!isLocationPopupVisible);
    if (!isLocationPopupVisible) {
      setSearchQuery(''); // 팝업이 열릴 때 검색어 초기화
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsLocationPopupVisible(false);
    onLocationClick(); // 부모 컴포넌트에 알림
  };

  const handleCurrentLocationClick = () => {
    // 현재 위치 사용 로직 (실제로는 geolocation API 사용)
    alert('현재 위치를 사용합니다.');
    setIsLocationPopupVisible(false);
  };

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* 돼동여지도 로고 (꿀꿀이 탐험가 마스코트) */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">🐷</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">🔍</span>
              </div>
            </div>
            <span className="text-pink-300 font-bold text-xl tracking-wide">돼동여지도</span>
          </div>
          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex gap-4 text-sm text-gray-300 items-center">
            <Link href="/" className="text-white">홈</Link>
            <Link href="/map" className="hover:text-white">지도</Link>
            <Link href="/favorites" className="hover:text-white">찜</Link>
            <Link href="/history" className="hover:text-white">방문기록</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {/* 지역 설정 버튼 */}
          <button 
            onClick={toggleLocationPopup}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-3 py-2 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="hidden sm:inline">{selectedLocation}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {/* 지도 토글 버튼 */}
          <button 
            onClick={onMapToggle}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-3 py-2 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="hidden sm:inline">{isMapMode ? '목록' : '지도'}</span>
          </button>
          {/* 검색 버튼 (스크롤 시에만 표시) */}
          <button 
            onClick={showFloatingSearch}
            className={`text-gray-300 hover:text-white transition-all duration-300 ${
              isHeaderSearchVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          {/* 모바일 햄버거 메뉴 버튼 */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          {/* 데스크톱 알림 버튼 */}
          <button className="hidden md:block text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5z"></path>
            </svg>
          </button>
          {/* 데스크톱 프로필 */}
          <div className="hidden md:block w-8 h-8 bg-gray-700 rounded-full"></div>
        </div>
      </header>

      {/* 플로팅 검색 섹션 (스크롤 시 표시) */}
      <div 
        className={`fixed top-16 left-0 right-0 bg-black border-b border-gray-800 px-6 py-4 z-40 transition-transform duration-300 ${
          isSearchVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input 
              id="floatingSearchInput"
              type="text" 
              placeholder="맛집, 메뉴, 유튜버 검색" 
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-full text-sm pl-10" 
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button className="p-2 bg-gray-800 rounded-full">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </button>
          <button 
            onClick={hideFloatingSearch}
            className="text-gray-400 hover:text-white ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

             {/* Location Selection Popup */}
       {isLocationPopupVisible && (
         <div 
           className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20"
           onClick={toggleLocationPopup}
         >
           <div 
             className="bg-gray-900 w-96 rounded-lg shadow-xl border border-gray-700"
             onClick={(e) => e.stopPropagation()}
           >
             {/* Header */}
             <div className="flex justify-between items-center p-4 border-b border-gray-700">
               <h2 className="text-white text-lg font-medium">지역 변경</h2>
               <button 
                 onClick={toggleLocationPopup}
                 className="text-gray-400 hover:text-white"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                 </svg>
               </button>
             </div>

             {/* Content */}
             <div className="p-4 space-y-4">
               {/* Search Input */}
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="지역이나 동네로 검색하기" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                 />
               </div>

               {/* Current Location Button */}
               <button 
                 onClick={handleCurrentLocationClick}
                 className="w-full flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
               >
                 <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                 </svg>
                 현재 내 위치 사용하기
               </button>

               {/* Recommendations */}
               <div>
                 <h3 className="text-gray-400 text-sm mb-3">추천</h3>
                 <div className="space-y-2">
                   <button 
                     onClick={() => handleLocationSelect('송도동')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     인천광역시, 연수구, 송도동
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('강남구')}
                     className={`w-full text-left py-3 px-4 text-white rounded-lg transition-colors ${
                       selectedLocation === '강남구' ? 'bg-gray-700' : 'hover:bg-gray-700'
                     }`}
                   >
                     서울특별시, 강남구, 역삼동
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('양산시')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     경상남도, 양산시, 물금읍
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('화성시')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     경기도, 화성시, 봉담읍
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('아산시')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     충청남도, 아산시, 배방읍
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('서초구')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     서울특별시, 서초구, 서초동
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('양주시')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     경기도, 양주시, 옥정동
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('신림동')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     서울특별시, 강남구, 신림동
                   </button>
                   <button 
                     onClick={() => handleLocationSelect('천안시')}
                     className="w-full text-left py-3 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors"
                   >
                     충청남도, 천안시 서북구, 불당동
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute inset-0 flex">
            {/* 메뉴 패널 */}
            <div className="w-80 bg-black h-full p-6">
              {/* 모바일 메뉴 헤더 */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">🐷</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">🔍</span>
                    </div>
                  </div>
                  <span className="text-pink-300 font-bold text-xl tracking-wide">돼동여지도</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 모바일 네비게이션 */}
              <div className="space-y-4 mb-8">
                <Link href="/" className="block text-gray-300 hover:text-white py-2">
                  홈
                </Link>
                <Link href="/map" className="block text-gray-300 hover:text-white py-2">
                  지도
                </Link>
                <Link href="/favorites" className="block text-gray-300 hover:text-white py-2">
                  찜
                </Link>
                <Link href="/history" className="block text-gray-300 hover:text-white py-2">
                  방문기록
                </Link>
              </div>

              {/* 설정 섹션 */}
              <div className="border-t border-gray-800 pt-6">
                <div className="text-gray-400 text-sm mb-4">설정</div>
                <div className="space-y-3">
                  <button className="w-full text-left block text-gray-300 hover:text-white">
                    <div className="flex items-center justify-between">
                      <span>테마 설정</span>
                      <span className="text-pink-300">핑크</span>
                    </div>
                  </button>
                  <Link href="#" className="block text-gray-300 hover:text-white">알림 설정</Link>
                  <Link href="#" className="block text-gray-300 hover:text-white">개인정보</Link>
                </div>
              </div>

              {/* 지원 섹션 */}
              <div className="border-t border-gray-800 pt-6">
                <div className="text-gray-400 text-sm mb-4">지원</div>
                <div className="space-y-3">
                  <Link href="#" className="block text-gray-300 hover:text-white">고객센터</Link>
                  <Link href="#" className="block text-gray-300 hover:text-white">문의하기</Link>
                  <Link href="#" className="block text-gray-300 hover:text-white">앱 다운로드</Link>
                </div>
              </div>
            </div>
            
            {/* 빈 공간 (클릭 시 메뉴 닫기) */}
            <div 
              className="flex-1" 
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
} 