// 기본 Place 타입 (기존 호환성 유지)
export interface Place {
  id: string
  name: string
  description: string
  address: string
  category: string
  images: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

// 확장된 Place 타입 (새로운 기능용)
export interface PlaceExtended extends Place {
  rating: number
  reviewCount: number
  tags: string[]
  openingHours?: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  contact?: {
    phone?: string
    website?: string
    email?: string
  }
  createdAt: string
  updatedAt: string
}

// 기본 User 타입 (기존 호환성 유지)
export interface User {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

// API 관련 타입들 re-export
export * from './api'