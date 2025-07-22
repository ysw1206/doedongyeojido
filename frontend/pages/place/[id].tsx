import { useRouter } from 'next/router'

export default function PlaceDetail() {
  const router = useRouter()
  const { id } = router.query

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-2">Restaurant {id}</h1>
      <p>Placeholder for restaurant info and YouTube videos.</p>
    </main>
  )
}
