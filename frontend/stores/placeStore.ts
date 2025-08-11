'use client'

import { create } from 'zustand'
import { Place } from '@/types'

interface PlaceStore {
  places: Place[]
  setPlaces: (places: Place[]) => void
  favorites: string[]
  toggleFavorite: (placeId: string) => void
}

export const usePlaceStore = create<PlaceStore>((set) => ({
  places: [],
  setPlaces: (places) => set({ places }),
  favorites: [],
  toggleFavorite: (placeId) => 
    set((state) => ({
      favorites: state.favorites.includes(placeId)
        ? state.favorites.filter(id => id !== placeId)
        : [...state.favorites, placeId]
    }))
}))