export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function generateMetaImage(place: any): string {
  return place.images?.[0] || '/default-meta-image.jpg'
}