// MongoDB 초기화 스크립트
// 컨테이너가 처음 실행될 때 자동으로 실행됩니다

// doedong 데이터베이스 사용
db = db.getSiblingDB('doedong');

// places 컬렉션 생성 및 샘플 데이터 삽입
db.createCollection('places');

// 샘플 맛집 데이터
const samplePlaces = [
  {
    title: "홍대 맛집 1",
    lat: 37.5575,
    lng: 126.9234,
    videoId: "dQw4w9WgXcQ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "강남 맛집 2", 
    lat: 37.4979,
    lng: 127.0276,
    videoId: "dQw4w9WgXcQ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "서초 맛집 3",
    lat: 37.4837,
    lng: 127.0324,
    videoId: "dQw4w9WgXcQ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "마포 맛집 4",
    lat: 37.5665,
    lng: 126.9080,
    videoId: "dQw4w9WgXcQ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "종로 맛집 5",
    lat: 37.5735,
    lng: 126.9788,
    videoId: "dQw4w9WgXcQ",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 데이터 삽입
db.places.insertMany(samplePlaces);

// 인덱스 생성 (성능 향상)
db.places.createIndex({ "lat": 1, "lng": 1 });
db.places.createIndex({ "title": 1 });

print("✅ MongoDB 초기화 완료!");
print("📊 샘플 데이터 " + samplePlaces.length + "개 삽입됨");
print("🗄️  데이터베이스: doedong");
print("📋 컬렉션: places"); 