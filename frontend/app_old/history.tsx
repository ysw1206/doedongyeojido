import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PlaceCard from '../components/place/PlaceCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

// 샘플 방문기록 데이터
const sampleHistoryData = {
  totalVisits: 28,
  thisWeek: 12,
  thisMonth: 24,
  timeDistribution: {
    morning: 8,
    afternoon: 12,
    evening: 6,
    night: 2
  }
};

const sampleHistoryPlaces = [
  {
    id: '1',
    title: '강남역 맛집! 1인분도 가능한 이자카야 추천',
    description: '강남역 근처에 숨겨진 진짜 이자카야를 발견했습니다!',
    image: 'https://via.placeholder.com/320x180?text=방문기록+1',
    videoId: '8jLOx1hD3_o',
    category: '일식',
    youtuberCount: 3,
    youtuberName: '먹방유튜버 김철수',
    viewCount: '12.5만회',
    uploadTime: '2주 전',
    duration: '12:34',
    visitTime: '2시간 전 조회',
    visitDate: 'today'
  },
  {
    id: '2',
    title: '홍대 디저트 맛집 탐방! 인스타 감성 카페 3곳',
    description: '홍대에서 발견한 숨겨진 디저트 맛집들을 소개합니다.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+2',
    videoId: 'abc123',
    category: '디저트',
    youtuberCount: 5,
    youtuberName: '카페투어 이영희',
    viewCount: '8.2만회',
    uploadTime: '1주 전',
    duration: '8:45',
    visitTime: '4시간 전 조회',
    visitDate: 'today'
  },
  {
    id: '3',
    title: '신촌 술집 맛집! 대학생들이 추천하는 맛집',
    description: '신촌에서 대학생들이 즐겨 찾는 술집들을 소개합니다.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+3',
    videoId: 'def456',
    category: '술집',
    youtuberCount: 2,
    youtuberName: '술집탐방 박민수',
    viewCount: '5.7만회',
    uploadTime: '3일 전',
    duration: '15:22',
    visitTime: '6시간 전 조회',
    visitDate: 'today'
  },
  {
    id: '4',
    title: '종로 한식 맛집! 전통 한옥에서 즐기는 한정식',
    description: '종로에서 전통 한옥의 분위기를 느낄 수 있는 한정식 맛집.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+4',
    videoId: 'ghi789',
    category: '한식',
    youtuberCount: 7,
    youtuberName: '한식맛집 최지영',
    viewCount: '15.3만회',
    uploadTime: '1주 전',
    duration: '10:15',
    visitTime: '1일 전 조회',
    visitDate: 'yesterday'
  },
  {
    id: '5',
    title: '마포구 중식 맛집! 진짜 중국인이 운영하는 짜장면',
    description: '마포구에서 중국인이 직접 운영하는 진짜 짜장면 맛집.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+5',
    videoId: 'jkl012',
    category: '중식',
    youtuberCount: 4,
    youtuberName: '중식맛집 김동현',
    viewCount: '9.1만회',
    uploadTime: '5일 전',
    duration: '6:42',
    visitTime: '1일 전 조회',
    visitDate: 'yesterday'
  },
  {
    id: '6',
    title: '강남 양식 맛집! 데이트하기 좋은 이탈리안 레스토랑',
    description: '강남에서 데이트하기 좋은 분위기의 이탈리안 레스토랑.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+6',
    videoId: 'mno345',
    category: '양식',
    youtuberCount: 6,
    youtuberName: '데이트맛집 이수진',
    viewCount: '7.8만회',
    uploadTime: '2일 전',
    duration: '11:28',
    visitTime: '1일 전 조회',
    visitDate: 'yesterday'
  },
  {
    id: '7',
    title: '서울 맛집 투어! 강남에서 홍대까지 맛집 지도',
    description: '서울 전역의 맛집들을 한 번에 둘러보는 투어 영상.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+7',
    videoId: 'pqr678',
    category: '투어',
    youtuberCount: 12,
    youtuberName: '맛집탐방 최민수',
    viewCount: '22.1만회',
    uploadTime: '3일 전',
    duration: '9:15',
    visitTime: '3일 전 조회',
    visitDate: 'thisWeek'
  },
  {
    id: '8',
    title: '신촌 카페 맛집! 대학생들이 몰리는 숨은 맛집',
    description: '신촌에서 대학생들이 몰리는 숨겨진 카페 맛집들.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+8',
    videoId: 'stu901',
    category: '카페',
    youtuberCount: 4,
    youtuberName: '카페투어 박지영',
    viewCount: '6.8만회',
    uploadTime: '4일 전',
    duration: '7:33',
    visitTime: '4일 전 조회',
    visitDate: 'thisWeek'
  },
  {
    id: '9',
    title: '이태원 양식 맛집! 분위기 좋은 레스토랑',
    description: '이태원에서 분위기 좋은 양식 레스토랑을 소개합니다.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+9',
    videoId: 'vwx234',
    category: '양식',
    youtuberCount: 8,
    youtuberName: '양식맛집 김영희',
    viewCount: '18.5만회',
    uploadTime: '1주 전',
    duration: '13:45',
    visitTime: '5일 전 조회',
    visitDate: 'thisWeek'
  },
  {
    id: '10',
    title: '강남 카페 맛집! 힙한 카페 투어',
    description: '강남에서 힙한 분위기의 카페들을 투어합니다.',
    image: 'https://via.placeholder.com/320x180?text=방문기록+10',
    videoId: 'yza567',
    category: '카페',
    youtuberCount: 6,
    youtuberName: '카페투어 이민수',
    viewCount: '14.2만회',
    uploadTime: '2주 전',
    duration: '8:20',
    visitTime: '6일 전 조회',
    visitDate: 'thisWeek'
  }
];

// 방문기록 카드 컴포넌트
function HistoryCard({ place }: { place: any }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors">
      <div className="relative">
        <img src={place.image} alt={place.title} className="w-full aspect-video object-cover" />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
          {place.duration}
        </div>
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs px-2 py-1 rounded">
          방문기록
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
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700">
          <span className="text-xs text-gray-400">{place.visitTime}</span>
          <button className="text-xs text-pink-400 hover:text-pink-300">재시청</button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState({
    today: true,
    thisWeek: true,
    thisMonth: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // 필터링된 데이터 생성
  const filteredPlaces = useMemo(() => {
    let filtered = sampleHistoryPlaces;

    // 날짜 필터 적용
    const activeFilters = Object.keys(filters).filter(key => filters[key as keyof typeof filters]);
    if (activeFilters.length > 0) {
      filtered = filtered.filter(place => activeFilters.includes(place.visitDate));
    }

    // 검색 필터 적용
    if (searchQuery.trim()) {
      filtered = filtered.filter(place => 
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.youtuberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬 적용
    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort((a, b) => {
          const timeA = parseInt(a.visitTime.split(' ')[0]);
          const timeB = parseInt(b.visitTime.split(' ')[0]);
          return timeA - timeB;
        });
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => {
          const viewsA = parseFloat(a.viewCount.replace('만회', ''));
          const viewsB = parseFloat(b.viewCount.replace('만회', ''));
          return viewsB - viewsA;
        });
        break;
      case 'category':
        filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return filtered;
  }, [filters, searchQuery, sortBy]);

  // 날짜별로 그룹화
  const groupedPlaces = useMemo(() => {
    const groups = {
      today: filteredPlaces.filter(place => place.visitDate === 'today'),
      yesterday: filteredPlaces.filter(place => place.visitDate === 'yesterday'),
      thisWeek: filteredPlaces.filter(place => place.visitDate === 'thisWeek')
    };
    return groups;
  }, [filteredPlaces]);

  const handleLocationClick = () => {
    console.log('지역 설정 클릭');
  };

  const handleMapToggle = () => {
    console.log('지도 토글 클릭');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색:', searchQuery);
  };

  const handleVoiceSearch = () => {
    console.log('음성 검색');
  };

  const handleMobileFilterClick = () => {
    setMobileFilterOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      today: true,
      thisWeek: true,
      thisMonth: false
    });
    setSortBy('recent');
  };

  const handleApplyFilters = () => {
    setMobileFilterOpen(false);
    console.log('필터가 적용되었습니다.');
  };

  return (
    <>
      <Head>
        <title>방문기록 - 돼동여지도</title>
        <meta name="description" content="최근에 조회한 맛집 컨텐츠입니다" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Header 
          onLocationClick={handleLocationClick}
          onMapToggle={handleMapToggle}
          isMapMode={false}
        />

        <div className="pt-16">
          {/* 검색 바 */}
          <div className="px-6 py-4 bg-black border-b border-gray-800">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="방문기록 검색" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-full text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-pink-500" 
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button 
                type="button"
                onClick={handleVoiceSearch}
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
            </form>
          </div>

          {/* 본문 */}
          <main className="flex">
            {/* 사이드바 (데스크톱) */}
            <aside className="w-64 bg-black border-r border-gray-800 p-6 hidden xl:block">
              <div className="space-y-6">
                {/* 방문 통계 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">방문 통계</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">총 방문 기록</span>
                      <span className="text-white font-medium">{sampleHistoryData.totalVisits}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">이번 주</span>
                      <span className="text-white">{sampleHistoryData.thisWeek}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">이번 달</span>
                      <span className="text-white">{sampleHistoryData.thisMonth}개</span>
                    </div>
                  </div>
                </div>

                {/* 시간대별 분포 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">시간대별 분포</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">오전 (6-12시)</span>
                      <span className="text-white">{sampleHistoryData.timeDistribution.morning}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">오후 (12-18시)</span>
                      <span className="text-white">{sampleHistoryData.timeDistribution.afternoon}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">저녁 (18-24시)</span>
                      <span className="text-white">{sampleHistoryData.timeDistribution.evening}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">새벽 (0-6시)</span>
                      <span className="text-white">{sampleHistoryData.timeDistribution.night}개</span>
                    </div>
                  </div>
                </div>

                {/* 정렬 옵션 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">정렬</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="sort" 
                        value="recent"
                        checked={sortBy === 'recent'}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="accent-pink-500" 
                      />
                      <span className={sortBy === 'recent' ? 'text-white' : 'text-gray-400'}>최근 방문순</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="sort" 
                        value="popular"
                        checked={sortBy === 'popular'}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="accent-pink-500" 
                      />
                      <span className={sortBy === 'popular' ? 'text-white' : 'text-gray-400'}>인기순</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="sort" 
                        value="category"
                        checked={sortBy === 'category'}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="accent-pink-500" 
                      />
                      <span className={sortBy === 'category' ? 'text-white' : 'text-gray-400'}>카테고리별</span>
                    </label>
                  </div>
                </div>

                {/* 필터 옵션 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">필터</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={filters.today}
                        onChange={(e) => setFilters({...filters, today: e.target.checked})}
                        className="accent-pink-500" 
                      />
                      <span className={filters.today ? 'text-white' : 'text-gray-400'}>오늘</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={filters.thisWeek}
                        onChange={(e) => setFilters({...filters, thisWeek: e.target.checked})}
                        className="accent-pink-500" 
                      />
                      <span className={filters.thisWeek ? 'text-white' : 'text-gray-400'}>이번 주</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={filters.thisMonth}
                        onChange={(e) => setFilters({...filters, thisMonth: e.target.checked})}
                        className="accent-pink-500" 
                      />
                      <span className={filters.thisMonth ? 'text-white' : 'text-gray-400'}>이번 달</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* 방문기록 목록 */}
            <section className="flex-1 p-6">
              {/* 모바일 필터 버튼 */}
              <div className="xl:hidden mb-4">
                <button 
                  onClick={handleMobileFilterClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                  <span>필터</span>
                </button>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">방문기록</h1>
                <p className="text-gray-400">최근에 조회한 맛집 컨텐츠입니다</p>
              </div>

              {/* 오늘 */}
              {groupedPlaces.today.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4">오늘</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupedPlaces.today.map((place) => (
                      <HistoryCard key={place.id} place={place} />
                    ))}
                  </div>
                </div>
              )}

              {/* 어제 */}
              {groupedPlaces.yesterday.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4">어제</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupedPlaces.yesterday.map((place) => (
                      <HistoryCard key={place.id} place={place} />
                    ))}
                  </div>
                </div>
              )}

              {/* 이번 주 */}
              {groupedPlaces.thisWeek.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4">이번 주</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupedPlaces.thisWeek.map((place) => (
                      <HistoryCard key={place.id} place={place} />
                    ))}
                  </div>
                </div>
              )}

              {/* 필터링 결과가 없을 때 */}
              {filteredPlaces.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">검색 결과가 없습니다</div>
                  <p className="text-gray-500 text-sm">다른 검색어나 필터를 시도해보세요</p>
                </div>
              )}
            </section>
          </main>
        </div>

        <Footer />

        {/* 모바일 필터 모달 */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute inset-0 flex items-end lg:items-center justify-center">
              <div className="bg-black w-full lg:w-96 h-5/6 lg:h-auto max-h-screen overflow-y-auto rounded-t-lg lg:rounded-lg">
                {/* 모달 헤더 */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold text-white">방문기록 필터</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {/* 모달 내용 */}
                <div className="p-4 space-y-6">
                  {/* 정렬 옵션 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">정렬</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="radio" 
                          name="mobileSort" 
                          value="recent"
                          checked={sortBy === 'recent'}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="accent-pink-500" 
                        />
                        <span className={sortBy === 'recent' ? 'text-white' : 'text-gray-400'}>최근 방문순</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="radio" 
                          name="mobileSort" 
                          value="popular"
                          checked={sortBy === 'popular'}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="accent-pink-500" 
                        />
                        <span className={sortBy === 'popular' ? 'text-white' : 'text-gray-400'}>인기순</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="radio" 
                          name="mobileSort" 
                          value="category"
                          checked={sortBy === 'category'}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="accent-pink-500" 
                        />
                        <span className={sortBy === 'category' ? 'text-white' : 'text-gray-400'}>카테고리별</span>
                      </label>
                    </div>
                  </div>

                  {/* 날짜 필터 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">날짜</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={filters.today}
                          onChange={(e) => setFilters({...filters, today: e.target.checked})}
                          className="accent-pink-500" 
                        />
                        <span className={filters.today ? 'text-white' : 'text-gray-400'}>오늘</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={filters.thisWeek}
                          onChange={(e) => setFilters({...filters, thisWeek: e.target.checked})}
                          className="accent-pink-500" 
                        />
                        <span className={filters.thisWeek ? 'text-white' : 'text-gray-400'}>이번 주</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={filters.thisMonth}
                          onChange={(e) => setFilters({...filters, thisMonth: e.target.checked})}
                          className="accent-pink-500" 
                        />
                        <span className={filters.thisMonth ? 'text-white' : 'text-gray-400'}>이번 달</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 모달 액션 버튼 */}
                <div className="p-4 border-t border-gray-800 flex gap-3">
                  <button 
                    onClick={handleClearFilters}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600"
                  >
                    전체 해제
                  </button>
                  <button 
                    onClick={handleApplyFilters}
                    className="flex-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white py-2 rounded-lg hover:from-pink-500 hover:to-pink-600"
                  >
                    필터 적용
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 