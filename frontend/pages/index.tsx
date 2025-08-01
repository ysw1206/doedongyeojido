import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import SearchSection from '../components/layout/SearchSection';
import Footer from '../components/layout/Footer';
import CategoryFilter from '../components/filter/CategoryFilter';
import PlaceCard from '../components/place/PlaceCard';
import Sidebar from '../components/layout/Sidebar';
import MobileFilterModal from '../components/layout/MobileFilterModal';
import ShortsSection from '../components/shorts/ShortsSection';

// 숏츠 샘플 데이터
const sampleShorts = [
  {
    "id": "shorts1",
    "title": "12000원에 이게 다 무제한이라고?😳",
    "image": "https://img.youtube.com/vi/xZUaA5mmRl0/maxresdefault.jpg",
    "duration": "13s",
    "viewCount": "조회수 484,513회",
    "videoId": "xZUaA5mmRl0"
  },
  {
    "id": "shorts2",
    "title": "신세계 정용진 회장도 다녀간 아산 탕수육 맛집!",
    "image": "https://img.youtube.com/vi/7DjJfMU3rM8/maxresdefault.jpg",
    "duration": "18s",
    "viewCount": "조회수 61,653회",
    "videoId": "7DjJfMU3rM8"
  },
  {
    "id": "shorts3",
    "title": "쿠우쿠우 가지마세요 ㅠㅠ",
    "image": "https://img.youtube.com/vi/IJAQjqOB5Kw/maxresdefault.jpg",
    "duration": "29s",
    "viewCount": "조회수 1,483,912회",
    "videoId": "IJAQjqOB5Kw"
  },
  {
    "id": "shorts4",
    "title": "오사카 6일 29끼 찐맛집 족보정리",
    "image": "https://img.youtube.com/vi/bVEWtDpZlP4/maxresdefault.jpg",
    "duration": "16s",
    "viewCount": "조회수 6,228,954회",
    "videoId": "bVEWtDpZlP4"
  },
  {
    "id": "shorts5",
    "title": "이거 안보고 경주 여행가면 후회합니다",
    "image": "https://img.youtube.com/vi/CCccRZ3nQMI/maxresdefault.jpg",
    "duration": "56s",
    "viewCount": "조회수 892,996회",
    "videoId": "CCccRZ3nQMI"
  },
  {
    "id": "shorts6",
    "title": "70가지 요리가 무제한??",
    "image": "https://img.youtube.com/vi/nJTUmZd4ox4/maxresdefault.jpg",
    "duration": "27s",
    "viewCount": "조회수 1,228,469회",
    "videoId": "nJTUmZd4ox4"
  },
  {
    "id": "shorts1",
    "title": "대구 한식 맛집 추천합니다! 맛집TOP10",
    "image": "https://img.youtube.com/vi/pTzYtwghCfI/maxresdefault.jpg",
    "duration": "24s",
    "viewCount": "조회수 43,783회",
    "videoId": "pTzYtwghCfI"
  },
  {
    "id": "shorts2",
    "title": "도쿄 7박 30끼 찐맛집 족보정리",
    "image": "https://img.youtube.com/vi/auzLDsEw74w/maxresdefault.jpg",
    "duration": "15s",
    "viewCount": "조회수 11,369,042회",
    "videoId": "auzLDsEw74w"
  }
];

// 샘플 데이터
const samplePlaces = [
  {
    "id": "1",
    "title": "Since 1939) 끝없는 맛집들로 꽉❕꽉❕ 채워진 노원구 공릉동 👹도깨비시장 (꽈배기, 육개장, 닭발) [ENG]",
    "description": "#홍석천  #이원일 #노원구 #꽈배기\n\n***광고 절대 아님***\n***모든 음식값 지불***\n\n경춘선 철도를 따라 지켜온 상인들의 손맛\n이젠 ...",
    "image": "https://img.youtube.com/vi/6e2qb_9w4TE/maxresdefault.jpg",
    "videoId": "6e2qb_9w4TE",
    "category": "카페",
    "youtuberCount": 4,
    "youtuberName": "홍석천이원일",
    "viewCount": "조회수 503,204회",
    "uploadTime": "3달 전",
    "duration": "28:39",
    "distance": "580m"
  },
  {
    "id": "2",
    "title": "충격받을 준비 되셨나요? 살다 살다 이런 뷔페는 처음입니다.",
    "description": "훈태의 일기📜\n\n이 세상엔 정말 미친 무한리필들이 많다.\n나는 그 중에 한 곳..\n호남 1짱 돈까스뷔페\n돈페라는 곳을 다녀왔다.\n돈페.. 역시나...",
    "image": "https://img.youtube.com/vi/GzhIY4TgI3g/maxresdefault.jpg",
    "videoId": "GzhIY4TgI3g",
    "category": "한식",
    "youtuberCount": 5,
    "youtuberName": "섬마을훈태TV",
    "viewCount": "조회수 236,954회",
    "uploadTime": "1주 전",
    "duration": "11:26",
    "distance": "157m"
  },
  {
    "id": "3",
    "title": "수원 광교 맛집 BEST 12",
    "description": "수원 광교에 왔어요! 광교는 호수공원도 있고 카페거리도 있어서 이쪽으로 놀러오기도 참으로 좋은 동네같았어요! 특히 신도시이다보니 거리도 깨끗하고...",
    "image": "https://img.youtube.com/vi/_cmrFEFxV-8/maxresdefault.jpg",
    "videoId": "_cmrFEFxV-8",
    "category": "고기집",
    "youtuberCount": 4,
    "youtuberName": "하이갱스 higaengs",
    "viewCount": "조회수 111,282회",
    "uploadTime": "1달 전",
    "duration": "26:16",
    "distance": "479m"
  },
  {
    "id": "4",
    "title": "[sub] 성시경의 먹을텐데 l 부산 중앙역 중앙곰탕",
    "description": "[중앙곰탕]\n부산 중구 충장대로9번길 9 동영빌딩지하 (중앙동4가 88-18)\n\n#양수백 #곰탕 #양곰탕\n#먹방 #맛집추천 #맛집탐방...",
    "image": "https://img.youtube.com/vi/k9pte2X-4NA/maxresdefault.jpg",
    "videoId": "k9pte2X-4NA",
    "category": "고기집",
    "youtuberCount": 3,
    "youtuberName": "성시경 SUNG SI KYUNG",
    "viewCount": "조회수 600,836회",
    "uploadTime": "3주 전",
    "duration": "21:28",
    "distance": "612m"
  },
  {
    "id": "5",
    "title": "광주 현지인도 놀라요. 도대체 여길 어떻게 알고 다녀왔는지",
    "description": "“쿠팡 파트너스 활동의 일환으로 이에 따른 일정액의 수수료를 제공받습니다”\n👉https://link.coupang.com/a/cAviOI\n둘시네...",
    "image": "https://img.youtube.com/vi/28nYi3wP60s/maxresdefault.jpg",
    "videoId": "28nYi3wP60s",
    "category": "일식",
    "youtuberCount": 4,
    "youtuberName": "둘시네아 dulcinea",
    "viewCount": "조회수 97,327회",
    "uploadTime": "6일 전",
    "duration": "42:18",
    "distance": "338m"
  },
  {
    "id": "6",
    "title": "매일 덥다고 하는 일본인아내 대구 데려갔다가 맛집으로 화풀린 날..[대구 ep.1]",
    "description": "요즘 에어컨 켜도 요리하거나 세라를 안으면 바로 더워지더라고요🥹\n계속 덥다고 했더니 대구를 데려가는 남편에게\n짜증이 날 뻔했지만(?) 다행히 남...",
    "image": "https://img.youtube.com/vi/Lng9Vm56Fzs/maxresdefault.jpg",
    "videoId": "Lng9Vm56Fzs",
    "category": "한식",
    "youtuberCount": 5,
    "youtuberName": "네루짱NERU",
    "viewCount": "조회수 147,590회",
    "uploadTime": "1일 전",
    "duration": "19:23",
    "distance": "167m"
  },
  {
    "id": "7",
    "title": "(ENG) 용산에서 제대로 된 세끼 추천해드립니다ㅣ명수세끼 용산맛집ㅣ할명수 ep.207",
    "description": "명-하!\n\n깨스야 다음은 어느 동네\n세끼가 좋을까?\n\n*00:00 용산 세끼*\n\n01:53 오제제🐷\n서울 용산구 한강대로 100 지하1층 B10...",
    "image": "https://img.youtube.com/vi/xMgMpVIl1Rc/maxresdefault.jpg",
    "videoId": "xMgMpVIl1Rc",
    "category": "고기집",
    "youtuberCount": 5,
    "youtuberName": "할명수",
    "viewCount": "조회수 1,081,001회",
    "uploadTime": "9달 전",
    "duration": "17:25",
    "distance": "609m"
  },
  {
    "id": "8",
    "title": "야장하면 떠오르는 을지로 노포에서 1끼 8메뉴 먹고 온 이장우 (ft. 막창, 미나리, 배추전, 짜글이, 볶음밥, 짜파게티, 김치, 막걸리)",
    "description": "부여식품 삼촌세트 이벤트 (8월 3일까지)\n👉🏼 https://bit.ly/4lULPKo\n\n#을지로맛집 #맛집추천 #이장우...",
    "image": "https://img.youtube.com/vi/HSqpNLfdUJs/maxresdefault.jpg",
    "videoId": "HSqpNLfdUJs",
    "category": "중식",
    "youtuberCount": 4,
    "youtuberName": "살찐삼촌 이장우",
    "viewCount": "조회수 106,233회",
    "uploadTime": "3일 전",
    "duration": "10:58",
    "distance": "134m"
  },
  {
    "id": "9",
    "title": "부산 맛집추천 Best🎖️해운대 토박이 2025 로컬맛집모음zip.(부산국밥1등,20년째 단골,제철해산물,갓성비맛집,해장맛집,영도,광안리,온천장,서면,해운대,송정,기장) 부산존맛",
    "description": "#부산맛집 #부산맛집추천 #해운대맛집 \n\n\n▫️ 이 영상은 유료광고를 포함하지 않습니다.\n\n\nInstagram :  https://www.ins...",
    "image": "https://img.youtube.com/vi/T4Vd_ZzxFGw/maxresdefault.jpg",
    "videoId": "T4Vd_ZzxFGw",
    "category": "한식",
    "youtuberCount": 4,
    "youtuberName": "포푼젤 Popunzel",
    "viewCount": "조회수 22,721회",
    "uploadTime": "2주 전",
    "duration": "17:52",
    "distance": "712m"
  },
  {
    "id": "10",
    "title": "나오자마자 압도되는 미친 해장국맛집!",
    "description": "#해장국맛집 #유가네원조양평해장국 #일산맛집\n#파주맛집 #덕이동맛집 #국밥맛집 #일산국밥 #파주국밥 #맛집소개 #맛집리뷰 #해내탕 #부속맛집\n\n...",
    "image": "https://img.youtube.com/vi/MXD9aHTty24/maxresdefault.jpg",
    "videoId": "MXD9aHTty24",
    "category": "분식",
    "youtuberCount": 1,
    "youtuberName": "이쌍쌍 ssangssang",
    "viewCount": "조회수 664,015회",
    "uploadTime": "1년 전",
    "duration": "1:57",
    "distance": "883m"
  },
  {
    "id": "11",
    "title": "분당 토박이들이 말하는 진짜 중국집, 입소문 날 만했네요",
    "description": "#레이먼킴 #분당맛집 #중국집 #중식맛집\n\n명희원\n-경기 성남시 분당구 정자동 166-3\n\n먹은음식\n-짜장면, 짬뽕, 탕수육, 볶음밥...",
    "image": "https://img.youtube.com/vi/lNW3omIZZW4/maxresdefault.jpg",
    "videoId": "lNW3omIZZW4",
    "category": "고기집",
    "youtuberCount": 3,
    "youtuberName": "레이먼킴의 인생고기 RaymonKim Meat",
    "viewCount": "조회수 56,476회",
    "uploadTime": "2주 전",
    "duration": "6:21",
    "distance": "842m"
  },
  {
    "id": "12",
    "title": "모두가 기다린 안양, 정면돌파하고👊 1등 맛집 찾았습니다 | 또간집 EP.79",
    "description": "댓글 민심 폭발했던 또간집 안양 편.. 인덕원부터 평촌 안양 바닥 싹 다 뒤졌습니다.\n정말 끝까지 갔던 안양에서 모두가 만족할 근본 맛집 종결합...",
    "image": "https://img.youtube.com/vi/hbFzeLwe7yg/maxresdefault.jpg",
    "videoId": "hbFzeLwe7yg",
    "category": "중식",
    "youtuberCount": 1,
    "youtuberName": "스튜디오 수제",
    "viewCount": "조회수 1,584,520회",
    "uploadTime": "1달 전",
    "duration": "38:19",
    "distance": "319m"
  }
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMapMode, setIsMapMode] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('gangnam');
  const [selectedYoutuberCounts, setSelectedYoutuberCounts] = useState(['3']);

  const handleLocationClick = () => {
    setLocationModalOpen(true);
  };

  const handleMapToggle = () => {
    setIsMapMode(!isMapMode);
  };

  const handleMobileFilterClick = () => {
    setMobileFilterOpen(true);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleYoutuberCountChange = (count: string) => {
    setSelectedYoutuberCounts(prev => {
      if (prev.includes(count)) {
        return prev.filter(c => c !== count);
      } else {
        return [...prev, count];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedLocation('gangnam');
    setSelectedYoutuberCounts(['3']);
  };

  const handleApplyFilters = () => {
    setMobileFilterOpen(false);
    // 여기에 필터 적용 로직 추가
    console.log('필터가 적용되었습니다.');
  };

  const filteredPlaces = selectedCategory === 'all' 
    ? samplePlaces 
    : samplePlaces.filter(place => {
        const categoryMap: { [key: string]: string } = {
          korean: '한식',
          japanese: '일식',
          chinese: '중식',
          western: '양식',
          dessert: '디저트',
          cafe: '카페',
          bar: '술집'
        };
        return place.category === categoryMap[selectedCategory];
      });

  return (
    <>
      <Head>
        <title>돼동여지도 - 유튜브 맛집을 직접 방문해보세요</title>
        <meta name="description" content="유튜버들이 추천하는 맛집을 찾아보세요. 돼동여지도에서 진짜 맛집을 발견하세요." />
        <link rel="icon" href="/favicon.ico" />
        <style jsx global>{`
          /* 스크롤바 숨기기 */
          ::-webkit-scrollbar {
            display: none;
          }
          /* Firefox용 스크롤바 숨기기 */
          html {
            scrollbar-width: none;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Header 
          onLocationClick={handleLocationClick}
          onMapToggle={handleMapToggle}
          isMapMode={isMapMode}
        />

        <div className="pt-16">
          <SearchSection 
            onSearch={(query) => console.log('검색:', query)}
            onVoiceSearch={() => console.log('음성 검색')}
          />

          {/* 카테고리 필터 */}
          <div className="px-6 py-3 bg-black border-b border-gray-800">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <main className="flex">
            {/* 사이드바 (데스크탑) */}
            <Sidebar 
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              selectedYoutuberCounts={selectedYoutuberCounts}
              onYoutuberCountChange={handleYoutuberCountChange}
            />

            {/* 맛집 영상 목록 (목록 모드) */}
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

              {/* 숏츠 섹션 */}
              <ShortsSection shorts={sampleShorts} />

              {/* 맛집 목록 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    {...place}
                  />
                ))}
              </div>

              {/* 빈 상태 */}
              {filteredPlaces.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">검색 결과가 없습니다</div>
                  <div className="text-gray-500 text-sm">다른 카테고리나 검색어를 시도해보세요</div>
                </div>
              )}
            </section>
          </main>
        </div>

        {/* 모바일 필터 모달 */}
        <MobileFilterModal
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          selectedYoutuberCounts={selectedYoutuberCounts}
          onYoutuberCountChange={handleYoutuberCountChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <Footer />
      </div>
    </>
  );
}
