const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

export const api = {
  places: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/places`)
      if (!res.ok) throw new Error('Failed to fetch places')
      return res.json()
    },
    getById: async (id: string) => {
      const res = await fetch(`${BASE_URL}/places/${id}`)
      if (!res.ok) throw new Error('Failed to fetch place')
      return res.json()
    }
  }
}