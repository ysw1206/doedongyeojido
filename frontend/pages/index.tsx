import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {})
    }
  }, [])

  return (
    <main className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Doedongyeojido</h1>
      <p>Grant location permission to explore nearby restaurants.</p>
    </main>
  )
}
