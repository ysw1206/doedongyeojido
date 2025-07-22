import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Place {
  _id: string
  title: string
  lat: number
  lng: number
  videoId: string
}

export default function PlaceDetail() {
  const router = useRouter()
  const { id } = router.query
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchPlace = async () => {
      try {
        const response = await fetch(`http://localhost:4000/places/${id}`)
        if (!response.ok) {
          throw new Error('Place not found')
        }
        const data = await response.json()
        setPlace(data)
      } catch (err) {
        setError('맛집 정보를 불러오는데 실패했습니다.')
        console.error('Error fetching place:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlace()
  }, [id])

  if (loading) {
    return (
      <main className="p-4">
        <h1 className="text-xl font-bold mb-2">로딩 중...</h1>
      </main>
    )
  }

  if (error || !place) {
    return (
      <main className="p-4">
        <h1 className="text-xl font-bold mb-2">맛집 상세</h1>
        <p className="text-red-500">{error || '맛집을 찾을 수 없습니다.'}</p>
        <Link href="/places" className="text-blue-500 hover:underline">
          맛집 목록으로 돌아가기
        </Link>
      </main>
    )
  }

  return (
    <main className="p-4">
      <div className="mb-4">
        <Link href="/places" className="text-blue-500 hover:underline">
          ← 맛집 목록으로 돌아가기
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">{place.title}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-2">위치 정보</h2>
          <p className="text-gray-600 mb-2">
            위도: {place.lat.toFixed(6)}
          </p>
          <p className="text-gray-600 mb-4">
            경도: {place.lng.toFixed(6)}
          </p>
          
          <div className="mb-4">
            <a 
              href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Google Maps에서 보기
            </a>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">YouTube 영상</h2>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${place.videoId}`}
              title={place.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-2">
            <a 
              href={`https://www.youtube.com/watch?v=${place.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              YouTube에서 보기
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">API 정보</h3>
        <p className="text-sm text-gray-600">
          API 엔드포인트: <code className="bg-gray-200 px-1 rounded">http://localhost:4000/places/{id}</code>
        </p>
      </div>
    </main>
  )
}
