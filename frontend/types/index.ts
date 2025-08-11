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

export interface User {
  id: string
  name: string
  email: string
}