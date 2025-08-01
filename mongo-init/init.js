// MongoDB 초기화 스크립트
// 돼동여지도 서비스용 데이터베이스 스키마 및 샘플 데이터

// doedong 데이터베이스 사용
db = db.getSiblingDB('doedong');

print("🚀 돼동여지도 MongoDB 초기화 시작...");

// ========================================
// 1. 카테고리 컬렉션 생성
// ========================================
db.createCollection('categories');

const categories = [
  {
    _id: ObjectId(),
    name: 'korean',
    displayName: '한식',
    icon: '🍚',
    color: '#FF6B6B',
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'japanese',
    displayName: '일식',
    icon: '🍣',
    color: '#4ECDC4',
    sortOrder: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'chinese',
    displayName: '중식',
    icon: '🥢',
    color: '#45B7D1',
    sortOrder: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'western',
    displayName: '양식',
    icon: '🍝',
    color: '#96CEB4',
    sortOrder: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'dessert',
    displayName: '디저트',
    icon: '🍰',
    color: '#FFEAA7',
    sortOrder: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'cafe',
    displayName: '카페',
    icon: '☕',
    color: '#DDA0DD',
    sortOrder: 6,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'bar',
    displayName: '술집',
    icon: '🍺',
    color: '#98D8C8',
    sortOrder: 7,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.categories.insertMany(categories);
print("✅ 카테고리 데이터 " + categories.length + "개 삽입됨");

// ========================================
// 2. 유튜버 컬렉션 생성
// ========================================
db.createCollection('youtubers');

const youtubers = [
  {
    _id: ObjectId(),
    channelId: 'UC123456789',
    name: '먹방유튜버 김철수',
    avatarUrl: 'https://via.placeholder.com/150x150?text=김',
    subscriberCount: 452000,
    videoCount: 156,
    description: '맛있는 음식을 찾아다니는 먹방 유튜버입니다.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    channelId: 'UC987654321',
    name: '카페투어 이영희',
    avatarUrl: 'https://via.placeholder.com/150x150?text=이',
    subscriberCount: 321000,
    videoCount: 89,
    description: '아름다운 카페들을 소개하는 유튜버입니다.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    channelId: 'UC456789123',
    name: '술집탐방 박민수',
    avatarUrl: 'https://via.placeholder.com/150x150?text=박',
    subscriberCount: 187000,
    videoCount: 67,
    description: '술집과 펍을 탐방하는 유튜버입니다.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    channelId: 'UC789123456',
    name: '한식맛집 최지영',
    avatarUrl: 'https://via.placeholder.com/150x150?text=최',
    subscriberCount: 298000,
    videoCount: 123,
    description: '전통 한식 맛집을 소개하는 유튜버입니다.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    channelId: 'UC321654987',
    name: '중식맛집 김동현',
    avatarUrl: 'https://via.placeholder.com/150x150?text=김동',
    subscriberCount: 156000,
    videoCount: 78,
    description: '진짜 중국 음식을 찾아다니는 유튜버입니다.',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.youtubers.insertMany(youtubers);
print("✅ 유튜버 데이터 " + youtubers.length + "개 삽입됨");

// ========================================
// 3. 맛집 컬렉션 생성
// ========================================
db.createCollection('places');

const places = [
  {
    _id: ObjectId(),
    title: '강남역 이자카야',
    description: '강남역 근처에 숨겨진 진짜 이자카야를 발견했습니다! 1인분도 가능해서 혼자 가기 좋고, 사케 종류도 정말 다양해요.',
    category: '일식',
    address: '서울 강남구 강남대로 123',
    lat: 37.498095,
    lng: 127.027610,
    phone: '02-1234-5678',
    businessHours: {
      monday: '18:00-02:00',
      tuesday: '18:00-02:00',
      wednesday: '18:00-02:00',
      thursday: '18:00-02:00',
      friday: '18:00-02:00',
      saturday: '18:00-02:00',
      sunday: '18:00-02:00'
    },
    priceRange: '15,000원 ~ 50,000원',
    parkingInfo: '매장별 상이',
    atmosphereTags: ['데이트', '회식', '혼술', '가족'],
    mainMenu: ['스키야키', '사케', '초밥', '라멘'],
    features: ['현지인 추천', '숨겨진 맛집', '데이트 코스', '가성비 좋음'],
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
    ],
    youtuberCount: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    title: '홍대 디저트 카페',
    description: '홍대에서 발견한 숨겨진 디저트 맛집들을 소개합니다. 인스타 감성 카페들이 정말 많아요!',
    category: '디저트',
    address: '서울 마포구 홍대로 456',
    lat: 37.557192,
    lng: 126.925382,
    phone: '02-2345-6789',
    businessHours: {
      monday: '10:00-22:00',
      tuesday: '10:00-22:00',
      wednesday: '10:00-22:00',
      thursday: '10:00-22:00',
      friday: '10:00-22:00',
      saturday: '10:00-22:00',
      sunday: '10:00-22:00'
    },
    priceRange: '8,000원 ~ 25,000원',
    parkingInfo: '주차 불가',
    atmosphereTags: ['데이트', '친구', '인스타', '힙한'],
    mainMenu: ['티라미수', '마카롱', '아메리카노', '라떼'],
    features: ['인스타 감성', '힙한 분위기', '디저트 맛집', '카페 투어'],
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    ],
    youtuberCount: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    title: '신촌 술집',
    description: '신촌에서 대학생들이 즐겨 찾는 술집들을 소개합니다. 가성비 좋은 술집들이 많아요!',
    category: '술집',
    address: '서울 서대문구 신촌로 789',
    lat: 37.555946,
    lng: 126.936378,
    phone: '02-3456-7890',
    businessHours: {
      monday: '18:00-02:00',
      tuesday: '18:00-02:00',
      wednesday: '18:00-02:00',
      thursday: '18:00-02:00',
      friday: '18:00-02:00',
      saturday: '18:00-02:00',
      sunday: '18:00-02:00'
    },
    priceRange: '20,000원 ~ 60,000원',
    parkingInfo: '주차 불가',
    atmosphereTags: ['대학생', '회식', '친구', '혼술'],
    mainMenu: ['맥주', '소주', '안주', '치킨'],
    features: ['대학생 추천', '가성비 좋음', '분위기 좋음', '안주 맛있음'],
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop'
    ],
    youtuberCount: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    title: '종로 한정식',
    description: '종로에서 전통 한옥의 분위기를 느낄 수 있는 한정식 맛집입니다.',
    category: '한식',
    address: '서울 종로구 종로 101',
    lat: 37.570377,
    lng: 126.983432,
    phone: '02-4567-8901',
    businessHours: {
      monday: '11:00-21:00',
      tuesday: '11:00-21:00',
      wednesday: '11:00-21:00',
      thursday: '11:00-21:00',
      friday: '11:00-21:00',
      saturday: '11:00-21:00',
      sunday: '11:00-21:00'
    },
    priceRange: '25,000원 ~ 80,000원',
    parkingInfo: '주차 가능',
    atmosphereTags: ['가족', '데이트', '전통', '한옥'],
    mainMenu: ['한정식', '비빔밥', '갈비찜', '된장찌개'],
    features: ['전통 한옥', '한정식 맛집', '가족 모임', '데이트 코스'],
    images: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    ],
    youtuberCount: 7,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    title: '마포구 중식 맛집',
    description: '마포구에서 중국인이 직접 운영하는 진짜 짜장면 맛집입니다.',
    category: '중식',
    address: '서울 마포구 마포대로 202',
    lat: 37.5665,
    lng: 126.9080,
    phone: '02-5678-9012',
    businessHours: {
      monday: '11:00-21:00',
      tuesday: '11:00-21:00',
      wednesday: '11:00-21:00',
      thursday: '11:00-21:00',
      friday: '11:00-21:00',
      saturday: '11:00-21:00',
      sunday: '11:00-21:00'
    },
    priceRange: '8,000원 ~ 25,000원',
    parkingInfo: '주차 불가',
    atmosphereTags: ['가족', '친구', '혼밥', '가성비'],
    mainMenu: ['짜장면', '짬뽕', '탕수육', '깐풍기'],
    features: ['진짜 중국인', '짜장면 맛집', '가성비 좋음', '혼밥 가능'],
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    ],
    youtuberCount: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.places.insertMany(places);
print("✅ 맛집 데이터 " + places.length + "개 삽입됨");

// ========================================
// 4. 유튜브 영상 컬렉션 생성
// ========================================
db.createCollection('youtube_videos');

const youtubeVideos = [
  {
    _id: ObjectId(),
    placeId: places[0]._id, // 강남역 이자카야
    videoId: '8jLOx1hD3_o',
    title: '강남역 맛집! 1인분도 가능한 이자카야 추천',
    description: '강남역 근처에 숨겨진 진짜 이자카야를 발견했습니다!',
    youtuberName: '먹방유튜버 김철수',
    youtuberChannelId: 'UC123456789',
    viewCount: 125000,
    likeCount: 3200,
    commentCount: 156,
    duration: '12:34',
    uploadDate: new Date('2024-01-15'),
    thumbnailUrl: 'https://img.youtube.com/vi/8jLOx1hD3_o/maxresdefault.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    placeId: places[1]._id, // 홍대 디저트 카페
    videoId: 'abc123def',
    title: '홍대 디저트 맛집 탐방! 인스타 감성 카페 3곳',
    description: '홍대에서 발견한 숨겨진 디저트 맛집들을 소개합니다.',
    youtuberName: '카페투어 이영희',
    youtuberChannelId: 'UC987654321',
    viewCount: 82000,
    likeCount: 2100,
    commentCount: 89,
    duration: '8:45',
    uploadDate: new Date('2024-01-10'),
    thumbnailUrl: 'https://img.youtube.com/vi/abc123def/maxresdefault.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    placeId: places[2]._id, // 신촌 술집
    videoId: 'def456ghi',
    title: '신촌 술집 맛집! 대학생들이 추천하는 맛집',
    description: '신촌에서 대학생들이 즐겨 찾는 술집들을 소개합니다.',
    youtuberName: '술집탐방 박민수',
    youtuberChannelId: 'UC456789123',
    viewCount: 57000,
    likeCount: 1500,
    commentCount: 67,
    duration: '15:22',
    uploadDate: new Date('2024-01-08'),
    thumbnailUrl: 'https://img.youtube.com/vi/def456ghi/maxresdefault.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    placeId: places[3]._id, // 종로 한정식
    videoId: 'ghi789jkl',
    title: '종로 한식 맛집! 전통 한옥에서 즐기는 한정식',
    description: '종로에서 전통 한옥의 분위기를 느낄 수 있는 한정식 맛집.',
    youtuberName: '한식맛집 최지영',
    youtuberChannelId: 'UC789123456',
    viewCount: 153000,
    likeCount: 4200,
    commentCount: 234,
    duration: '10:15',
    uploadDate: new Date('2024-01-12'),
    thumbnailUrl: 'https://img.youtube.com/vi/ghi789jkl/maxresdefault.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    placeId: places[4]._id, // 마포구 중식 맛집
    videoId: 'jkl012mno',
    title: '마포구 중식 맛집! 진짜 중국인이 운영하는 짜장면',
    description: '마포구에서 중국인이 직접 운영하는 진짜 짜장면 맛집.',
    youtuberName: '중식맛집 김동현',
    youtuberChannelId: 'UC321654987',
    viewCount: 91000,
    likeCount: 1800,
    commentCount: 123,
    duration: '6:42',
    uploadDate: new Date('2024-01-06'),
    thumbnailUrl: 'https://img.youtube.com/vi/jkl012mno/maxresdefault.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.youtube_videos.insertMany(youtubeVideos);
print("✅ 유튜브 영상 데이터 " + youtubeVideos.length + "개 삽입됨");

// ========================================
// 5. 사용자 컬렉션 생성 (회원 기능 확장용)
// ========================================
db.createCollection('users');

const users = [
  {
    _id: ObjectId(),
    email: 'test@example.com',
    passwordHash: '$2b$10$example.hash.here', // 실제로는 bcrypt로 해시된 비밀번호
    nickname: '테스트유저',
    profileImage: 'https://via.placeholder.com/150x150?text=U',
    phone: '010-1234-5678',
    birthDate: new Date('1990-01-01'),
    gender: 'male',
    locationPreference: {
      defaultLat: 37.5665,
      defaultLng: 126.9780,
      preferredRegions: ['강남구', '마포구', '종로구']
    },
    notificationSettings: {
      email: true,
      push: true,
      sms: false
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    isActive: true,
    isVerified: true
  }
];

db.users.insertMany(users);
print("✅ 사용자 데이터 " + users.length + "개 삽입됨");

// ========================================
// 6. 사용자 찜하기 컬렉션 생성
// ========================================
db.createCollection('user_favorites');

const userFavorites = [
  {
    _id: ObjectId(),
    userId: users[0]._id,
    placeId: places[0]._id,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: users[0]._id,
    placeId: places[2]._id,
    createdAt: new Date()
  }
];

db.user_favorites.insertMany(userFavorites);
print("✅ 사용자 찜하기 데이터 " + userFavorites.length + "개 삽입됨");

// ========================================
// 7. 사용자 방문기록 컬렉션 생성
// ========================================
db.createCollection('user_history');

const userHistory = [
  {
    _id: ObjectId(),
    userId: users[0]._id,
    placeId: places[0]._id,
    videoId: youtubeVideos[0]._id,
    watchDuration: 450, // 7분 30초
    watchPercentage: 60.5,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: users[0]._id,
    placeId: places[1]._id,
    videoId: youtubeVideos[1]._id,
    watchDuration: 300, // 5분
    watchPercentage: 55.2,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4시간 전
  },
  {
    _id: ObjectId(),
    userId: users[0]._id,
    placeId: places[2]._id,
    videoId: youtubeVideos[2]._id,
    watchDuration: 600, // 10분
    watchPercentage: 65.8,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6시간 전
  }
];

db.user_history.insertMany(userHistory);
print("✅ 사용자 방문기록 데이터 " + userHistory.length + "개 삽입됨");

// ========================================
// 8. 사용자 선호도 컬렉션 생성
// ========================================
db.createCollection('user_preferences');

const userPreferences = [
  {
    _id: ObjectId(),
    userId: users[0]._id,
    categoryId: categories[0]._id, // 한식
    preferenceScore: 0.8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: users[0]._id,
    categoryId: categories[1]._id, // 일식
    preferenceScore: 0.7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: users[0]._id,
    categoryId: categories[6]._id, // 술집
    preferenceScore: 0.6,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.user_preferences.insertMany(userPreferences);
print("✅ 사용자 선호도 데이터 " + userPreferences.length + "개 삽입됨");

// ========================================
// 9. 인덱스 생성 (성능 최적화)
// ========================================

// Places 컬렉션 인덱스
db.places.createIndex({ "lat": 1, "lng": 1 }); // 지리적 검색
db.places.createIndex({ "category": 1 }); // 카테고리 검색
db.places.createIndex({ "title": "text", "description": "text" }); // 텍스트 검색
db.places.createIndex({ "createdAt": -1 }); // 최신순 정렬
db.places.createIndex({ "youtuberCount": -1 }); // 유튜버 수 정렬

// Youtube_videos 컬렉션 인덱스
db.youtube_videos.createIndex({ "placeId": 1 }); // 맛집별 영상 검색
db.youtube_videos.createIndex({ "viewCount": -1 }); // 조회수 정렬
db.youtube_videos.createIndex({ "uploadDate": -1 }); // 업로드 날짜 정렬
db.youtube_videos.createIndex({ "videoId": 1 }); // 비디오 ID 검색

// Users 컬렉션 인덱스
db.users.createIndex({ "email": 1 }, { unique: true }); // 이메일 중복 방지
db.users.createIndex({ "nickname": 1 }); // 닉네임 검색

// User_favorites 컬렉션 인덱스
db.user_favorites.createIndex({ "userId": 1, "placeId": 1 }, { unique: true }); // 중복 찜 방지
db.user_favorites.createIndex({ "createdAt": -1 }); // 찜한 날짜 정렬

// User_history 컬렉션 인덱스
db.user_history.createIndex({ "userId": 1, "createdAt": -1 }); // 사용자별 방문기록
db.user_history.createIndex({ "placeId": 1 }); // 맛집별 방문기록

// Categories 컬렉션 인덱스
db.categories.createIndex({ "sortOrder": 1 }); // 정렬 순서
db.categories.createIndex({ "isActive": 1 }); // 활성 카테고리만

print("✅ 인덱스 생성 완료");

// ========================================
// 10. 초기화 완료 메시지
// ========================================
print("\n🎉 돼동여지도 MongoDB 초기화 완료!");
print("📊 데이터베이스: doedong");
print("📋 생성된 컬렉션:");
print("   - categories: " + db.categories.countDocuments() + "개");
print("   - youtubers: " + db.youtubers.countDocuments() + "개");
print("   - places: " + db.places.countDocuments() + "개");
print("   - youtube_videos: " + db.youtube_videos.countDocuments() + "개");
print("   - users: " + db.users.countDocuments() + "개");
print("   - user_favorites: " + db.user_favorites.countDocuments() + "개");
print("   - user_history: " + db.user_history.countDocuments() + "개");
print("   - user_preferences: " + db.user_preferences.countDocuments() + "개");
print("\n🚀 서버를 시작하면 데이터베이스가 준비됩니다!"); 