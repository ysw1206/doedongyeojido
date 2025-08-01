import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      {/* 앱 다운로드 섹션 */}
      <section className="bg-[#3d2e27] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* 왼쪽: 앱 소개 및 다운로드 */}
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-orange-500">
                유튜브 맛집을 실제로 방문해보세요.
              </h2>
              <p className="text-2xl lg:text-3xl font-semibold text-white mb-8">
                지금 바로 다운로드하기
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* 로고 및 소셜미디어 */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
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
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
              
              {/* 로컬 데이터 안내 */}
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>찜과 방문기록은 브라우저에 저장됩니다</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  나중에 회원가입하면 모든 기기에서 동기화할 수 있어요
                </div>
              </div>
            </div>
            
            {/* 회사 */}
            <div>
              <h3 className="text-white font-semibold mb-4">회사</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">회사 소개</a>
                <a href="#" className="block hover:text-white">서비스 소개</a>
                <a href="#" className="block hover:text-white">팀문화</a>
                <a href="#" className="block hover:text-white">블로그</a>
                <a href="#" className="block hover:text-white">채용</a>
              </div>
            </div>
            
            {/* 탐색 */}
            <div>
              <h3 className="text-white font-semibold mb-4">탐색</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">맛집 지도</a>
                <a href="#" className="block hover:text-white">유튜버 맛집</a>
                <a href="#" className="block hover:text-white">지역별 맛집</a>
                <a href="#" className="block hover:text-white">메뉴별 맛집</a>
                <a href="#" className="block hover:text-white">찜한 맛집</a>
              </div>
            </div>
            
            {/* 비즈니스 */}
            <div>
              <h3 className="text-white font-semibold mb-4">비즈니스</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">맛집 등록</a>
                <a href="#" className="block hover:text-white">유튜버 캠페인</a>
                <a href="#" className="block hover:text-white">광고 문의</a>
              </div>
            </div>
            
            {/* 문의 */}
            <div>
              <h3 className="text-white font-semibold mb-4">문의</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">고객센터</a>
                <a href="#" className="block hover:text-white">오류 제보</a>
                <a href="#" className="block hover:text-white">문의하기</a>
              </div>
            </div>
          </div>
          
          {/* 하단 정보 */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500">
              <div>대표: 김맛집</div>
              <div>사업자번호: 123-45-67890</div>
              <div>주소: 서울특별시 강남구 테헤란로 123</div>
              <div>전화: 02-1234-5678</div>
              <div>고객문의: contact@matzipmap.com</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 