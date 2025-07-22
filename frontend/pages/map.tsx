import { useEffect, useState } from 'react'

interface Position {
  lat: number
  lng: number
}

export default function MapPage() {
  const [pos, setPos] = useState<Position | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setPos({ lat: coords.latitude, lng: coords.longitude })
    })
  }, [])

  return (
    <main className="w-full h-screen">
      {pos ? (
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          src={`https://www.google.com/maps?q=${pos.lat},${pos.lng}&z=15&output=embed`}
        />
      ) : (
        <p className="p-4">Fetching location...</p>
      )}
    </main>
  )
}
