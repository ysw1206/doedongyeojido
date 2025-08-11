export const CATEGORIES = [
  { id: 'restaurant', name: '음식점' },
  { id: 'cafe', name: '카페' },
  { id: 'culture', name: '문화시설' },
  { id: 'shopping', name: '쇼핑' }
] as const

export const MAP_CONFIG = {
  defaultCenter: { lat: 37.5665, lng: 126.9780 },
  defaultZoom: 13
}