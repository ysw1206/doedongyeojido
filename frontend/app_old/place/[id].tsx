import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// 샘플 데이터
const samplePlace = {
  id: '1',
  title: 'Since 1939) 끝없는 맛집들로 꽉❕꽉❕ 채워진 노원구 공릉동 👹도깨비시장 (꽈배기, 육개장, 닭발) [ENG]',
  description: '#홍석천  #이원일 #노원구 #꽈배기\n\n***광고 절대 아님***\n***모든 음식값 지불***\n\n경춘선 철도를 따라 지켜온 상인들의 손맛\n이젠 ...',
  image: 'https://img.youtube.com/vi/6e2qb_9w4TE/maxresdefault.jpg',
  videoId: 'hbFzeLwe7yg',
  category: '한식',
  youtuberCount: 3,
  youtuberName: '스튜디오 수제',
  viewCount: '1,584,520회',
  uploadTime: '2주 전',
  duration: '12:34',
  distance: '500m',
  location: '공릉동',
  address: '노원구 공릉동 일대',
  phone: '02-1234-5678',
  hours: '매장별 상이',
  reservation: '예약 가능',
  price: '15,000원 ~ 50,000원',
  parking: '매장별 상이',
  atmosphere: '데이트, 회식, 혼술, 가족',
  mainMenu: '다양한 한식, 일식, 양식',
  features: ['현지인 추천', '숨겨진 맛집', '데이트 코스', '가성비 좋음'],
  likes: '2.3천개',
  comments: '156개',
  lat: 37.5172, // 카카오 맵 좌표
  lng: 127.0479 // 카카오 맵 좌표
};

const sampleYoutubers = [
  {
    id: '1',
    name: '먹방유튜버 김철수',
    subscribers: '45.2만명',
    avatar: '김',
    color: 'bg-gradient-to-r from-pink-400 to-pink-500',
    review: '"1인분도 가능해서 혼자 가기 좋아요!"',
    visitTime: '2주 전'
  },
  {
    id: '2',
    name: '맛집탐방 이영희',
    subscribers: '32.1만명',
    avatar: '이',
    color: 'bg-gradient-to-r from-pink-300 to-pink-400',
    review: '"사케 종류가 정말 다양해요!"',
    visitTime: '1개월 전'
  },
  {
    id: '3',
    name: '혼술맛집 박민수',
    subscribers: '18.7만명',
    avatar: '박',
    color: 'bg-gradient-to-r from-pink-500 to-pink-600',
    review: '"혼술하기 정말 좋은 곳이에요!"',
    visitTime: '3개월 전'
  }
];

const sampleRelatedPlaces = [
  {
    id: '2',
    title: '홍대 숨겨진 이자카야! 현지인만 아는 맛집',
    youtuberName: '맛집탐방 이영희',
    viewCount: '8.2만회',
    uploadTime: '1주 전',
    duration: '8:45',
    category: '일식',
    youtuberCount: 2,
    image: 'https://via.placeholder.com/320x180?text=맛집+추천+1'
  },
  {
    id: '3',
    title: '신촌 혼술 맛집! 대학생들이 추천하는 술집',
    youtuberName: '혼술맛집 박민수',
    viewCount: '5.7만회',
    uploadTime: '3일 전',
    duration: '10:15',
    category: '술집',
    youtuberCount: 4,
    image: 'https://via.placeholder.com/320x180?text=맛집+추천+2'
  },
  {
    id: '4',
    title: '종로 전통 한식! 한옥에서 즐기는 한정식',
    youtuberName: '한식맛집 최지영',
    viewCount: '15.3만회',
    uploadTime: '1주 전',
    duration: '12:30',
    category: '한식',
    youtuberCount: 7,
    image: 'https://via.placeholder.com/320x180?text=맛집+추천+3'
  },
  {
    id: '5',
    title: '마포구 중식 맛집! 진짜 중국인이 운영하는 짜장면',
    youtuberName: '중식맛집 김동현',
    viewCount: '9.1만회',
    uploadTime: '5일 전',
    duration: '6:42',
    category: '중식',
    youtuberCount: 4,
    image: 'https://via.placeholder.com/320x180?text=맛집+추천+4'
  }
];

const sampleHighlights = [
  {
    name: '동해오징어보쌈',
    location: '안양동',
    address: '경기 안양시 만안구 장내로139번길 56-12 스타프라자',
    timestamp: '11:17',
    lat: 33.45296816767421,
    lng: 126.57192996936878,
    visited: true,
    phone: '031-422-0000'
  },
  {
    name: '홍두깨손칼국수',
    location: '안양동',
    address: '경기 안양시 만안구 장내로119번길 18',
    timestamp: '22:51',
    lat: 33.440263095625525,
    lng: 126.56889517853354,
    visited: true
  },
  {
    name: '얼룩말식당',
    location: '안양동',
    address: '경기 안양시 만안구 안양로329번길 23 1층',
    timestamp: '29:31',
    lat: 33.44639926247388,
    lng: 126.57041353251486,
    visited: true
  }
];

const KAKAO_MAP_API_KEY = 'b3e9e8ea77f4ea9745516bd4b2e39e21'; // 카카오 맵 API 키를 여기에 입력하세요

export default function PlaceDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const bounds = new window.kakao.maps.LatLngBounds();
        const options = {
          center: new window.kakao.maps.LatLng(samplePlace.lat, samplePlace.lng),
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        sampleHighlights.forEach((highlight) => {
          const markerPosition = new window.kakao.maps.LatLng(highlight.lat, highlight.lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(map);
          bounds.extend(markerPosition);

          window.kakao.maps.event.addListener(marker, 'click', () => {
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;">${highlight.name} <br/><a href="https://map.kakao.com/link/to/${highlight.name},${highlight.lat},${highlight.lng}" target="_blank">길찾기</a></div>`
            });
            infowindow.open(map, marker);

            map.setCenter(markerPosition);
            map.setLevel(3);
          });
        });

        map.setBounds(bounds);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);



  const handleTimestampClick = (timestamp) => {
    const videoElement = document.querySelector('iframe');
    const [minutes, seconds] = timestamp.split(':').map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    videoElement.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: 'seekTo',
      args: [timeInSeconds, true]
    }), '*');
  };

  return (
    <>
      <Head>
        <title>{samplePlace.title} - 돼동여지도</title>
        <meta name="description" content={samplePlace.description} />
        <style jsx global>{`
          ::-webkit-scrollbar {
            display: none;
          }
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

      <>
          {/* 브레드크럼 */}
          <div className="px-6 py-3 border-b border-gray-800">
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-white">홈</Link>
              <span className="mx-2">&gt;</span>
              <Link href="#" className="hover:text-white">{samplePlace.category}</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-white">{samplePlace.title}</span>
            </nav>
          </div>

          {/* 메인 콘텐츠 */}
          <main className="flex flex-col lg:flex-row">
            {/* 왼쪽 영상/이미지 영역 (고정) */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-16 lg:h-screen">
              <div className="p-6">
                <div className="relative">
                  {/* 유튜브 영상 임베드 */}
                  <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <iframe 
                      src={`https://www.youtube.com/embed/${samplePlace.videoId}`}
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen>
                    </iframe>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded">
                    {samplePlace.duration}
                  </div>
                </div>
                
                {/* 유튜버 정보 (왼쪽 영상 아래) */}
                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">김</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{samplePlace.youtuberName}</div>
                      <div className="text-sm text-gray-400">구독자 45.2만명</div>
                    </div>
                    <button className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200">
                      구독
                    </button>
                  </div>
                </div>

                {/* 맛집 이미지 갤러리 */}
                {/* <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">맛집 사진</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <img src="https://via.placeholder.com/150x100?text=맛집+사진+1" alt="맛집 사진" className="w-full h-20 object-cover rounded" />
                    <img src="https://via.placeholder.com/150x100?text=맛집+사진+2" alt="맛집 사진" className="w-full h-20 object-cover rounded" />
                    <img src="https://via.placeholder.com/150x100?text=맛집+사진+3" alt="맛집 사진" className="w-full h-20 object-cover rounded" />
                  </div>
                </div> */}

                {/* 영상 하이라이트 */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">영상 하이라이트</h3>
                  <ul className="space-y-2">
                    {sampleHighlights.map((highlight, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{highlight.name}</div>
                          <div className="text-sm text-gray-400">{highlight.location} - {highlight.address}</div>
                        </div>
                        <button 
                          className="text-pink-400 hover:text-pink-300 text-sm"
                          onClick={() => handleTimestampClick(highlight.timestamp)}
                        >
                          {highlight.timestamp}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 오른쪽 정보 영역 (스크롤 가능) */}
            <div className="w-full lg:w-1/2">
              <div className="p-6 space-y-6">
                {/* 맛집 제목 및 상태 */}
                <div>
                  <div className="inline-block bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs px-2 py-1 rounded mb-2">
                    유튜버 {samplePlace.youtuberCount}명 방문
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">{samplePlace.title}</h1>
                  <p className="text-sm text-gray-400">{samplePlace.uploadTime} 업로드</p>
                </div>

                {/* 주요 정보 바 */}
                <div className="flex bg-gray-800 rounded-lg p-4">
                  <div className="flex-1 text-center border-r border-gray-600">
                    <div className="text-2xl font-bold text-white">{samplePlace.viewCount}</div>
                    <div className="text-xs text-gray-400">조회수</div>
                  </div>
                  <div className="flex-1 text-center border-r border-gray-600">
                    <div className="text-lg font-semibold text-white">{samplePlace.category}</div>
                    <div className="text-xs text-gray-400">카테고리</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-semibold text-white">{samplePlace.location}</div>
                    <div className="text-xs text-gray-400">지역</div>
                  </div>
                </div>

                {/* 맛집 정보 */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">맛집 정보</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">매장명</span>
                      <span className="text-white">강남 숨겨진 맛집 모음</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">주소</span>
                      <span className="text-white">{samplePlace.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">전화번호</span>
                      <span className="text-white">{samplePlace.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">영업시간</span>
                      <span className="text-white">{samplePlace.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">예약가능</span>
                      <span className="text-green-400">{samplePlace.reservation}</span>
                    </div>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">상세 정보</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">평균 가격</span>
                      <span className="text-white">{samplePlace.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">주차</span>
                      <span className="text-white">{samplePlace.parking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">분위기</span>
                      <span className="text-white">{samplePlace.atmosphere}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">대표메뉴</span>
                      <span className="text-white">{samplePlace.mainMenu}</span>
                    </div>
                  </div>
                </div>

                {/* 추가 옵션 */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">특징</h2>
                  <div className="flex gap-2 flex-wrap">
                    {samplePlace.features.map((feature, index) => (
                      <span key={index} className="bg-gray-700 text-white text-sm px-3 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 상세 내용 */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">유튜버 후기</h2>
                  <div className="text-sm text-white leading-relaxed">
                    {samplePlace.description}
                  </div>
                </div>

                {/* 활동 정보 */}
                <div>
                  <div className="text-sm text-gray-400">
                    조회수 {samplePlace.viewCount}회 • 좋아요 {samplePlace.likes} • 댓글 {samplePlace.comments}개
                  </div>
                </div>

                {/* 지도 */}
                <div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="relative h-48 bg-gray-700 rounded-lg mb-3" id="map">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <p>지도 로딩 중...</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white">{samplePlace.address}</span>
                      <button className="text-sm text-gray-400 hover:text-white">복사 📋</button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">방문한 맛집</h3>
                  <ul className="space-y-2">
                    {sampleHighlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="bg-gray-800 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        {/* 맛집 이름 */}
                        <div>
                          <span className="text-white font-medium">{highlight.name}</span>
                        </div>

                        {/* 버튼 그룹 */}
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          {/* 찜하기 */}
                          <button
                            className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded"
                            onClick={() => {
                              alert(`'${highlight.name}'을(를) 찜했습니다.`);
                            }}
                          >
                            찜하기
                          </button>

                          {/* 지도 */}
                          <button
                            className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded"
                            onClick={() => {
                              const position = new window.kakao.maps.LatLng(highlight.lat, highlight.lng);
                              const mapContainer = document.getElementById('map');
                              const map = new window.kakao.maps.Map(mapContainer, {
                                center: position,
                                level: 3,
                              });
                              map.setCenter(position);
                            }}
                          >
                            지도
                          </button>

                          {/* 예약 */}
                          <button
                            className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded"
                            onClick={() => {
                              alert(`'${highlight.name}' 예약 페이지로 이동합니다. (준비 중)`);
                            }}
                          >
                            예약
                          </button>

                          {/* 전화걸기 */}
                          {highlight.phone && (
                            <a
                              href={`tel:${highlight.phone}`}
                              className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded"
                            >
                              전화걸기
                            </a>
                          )}

                          {/* 길찾기 */}
                          <a
                            href={`https://map.kakao.com/link/to/${highlight.name},${highlight.lat},${highlight.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-pink-400 hover:text-pink-300 bg-pink-900/20 px-3 py-1 rounded"
                          >
                            길찾기
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                

              </div>
            </div>
          </main>

          {/* 유튜버 방문 기록 */}
          <section className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">방문한 유튜버들</h2>
              <Link href="#" className="text-pink-400 hover:text-pink-300 text-sm">더 보기 &gt;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleYoutubers.map((youtuber) => (
                <div key={youtuber.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${youtuber.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold">{youtuber.avatar}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{youtuber.name}</div>
                      <div className="text-xs text-gray-400">구독자 {youtuber.subscribers}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">{youtuber.review}</div>
                  <div className="text-xs text-gray-500">{youtuber.visitTime} 방문</div>
                </div>
              ))}
            </div>
          </section>

          {/* 관련 맛집 추천 */}
          <section className="max-w-screen-xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-white">이런 맛집도 있어요</h1>
              <Link href="#" className="text-pink-400 hover:text-pink-300 text-sm">더 구경하기 &gt;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sampleRelatedPlaces.map((place) => (
                <Link key={place.id} href={`/place/${place.id}`} className="block">
                  <div className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors">
                    <div className="relative">
                      <img src={place.image} alt="맛집" className="w-full aspect-video object-cover" />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        {place.duration}
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
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
      </>
    </>
  );
}
