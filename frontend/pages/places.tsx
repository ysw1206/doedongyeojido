import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Place {
  _id: string
  title: string
  lat: number
  lng: number
  videoId: string
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://localhost:4000/places')
        if (!response.ok) {
          throw new Error('Failed to fetch places')
        }
        const data = await response.json()
        setPlaces(data)
      } catch (err) {
        setError('맛집 목록을 불러오는데 실패했습니다.')
        console.error('Error fetching places:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  if (loading) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">맛집 목록</h1>
        <p>로딩 중...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">맛집 목록</h1>
        <p className="text-red-500">{error}</p>
        <p className="mt-2 text-sm text-gray-600">
          백엔드 서버가 실행 중인지 확인해주세요. (http://localhost:4000)
        </p>
      </main>
    )
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">맛집 목록</h1>
      
      {places.length === 0 ? (
        <p className="text-gray-500">등록된 맛집이 없습니다.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <div key={place._id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">{place.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                위치: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
              </p>
              <div className="flex gap-2">
                <Link 
                  href={`/place/${place._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  상세보기
                </Link>
                <a 
                  href={`https://www.youtube.com/watch?v=${place.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">API 정보</h3>
        <p className="text-sm text-gray-600">
          백엔드 API: <code className="bg-gray-200 px-1 rounded">http://localhost:4000/places</code>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          총 {places.length}개의 맛집이 등록되어 있습니다.
        </p>
      </div>
    </main>
  )
} 