import React from 'react'
import PlaceDetailPageClient from './PlaceDetailPageClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PlaceDetailPage({ params }: Props) {
  const resolvedParams = await params;
  
  return <PlaceDetailPageClient params={resolvedParams} />;
}