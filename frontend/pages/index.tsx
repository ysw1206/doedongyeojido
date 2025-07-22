import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {})
    }
  }, [])

  return (
    <main className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Doedongyeojido</h1>
      <p className="mb-6">Grant location permission to explore nearby restaurants.</p>
      
      <div className="space-y-4">
        <Link 
          href="/places"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          맛집 목록 보기
        </Link>
        
        <div className="text-sm text-gray-600">
          <p>📍 <Link href="/map" className="text-blue-500 hover:underline">지도 보기</Link></p>
        </div>
      </div>
    </main>
  )
}
