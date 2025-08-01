import React from 'react';
import Link from 'next/link';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface PlaceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  videoId?: string;
  category: string;
  youtuberCount: number;
  distance?: string;
  rating?: number;
  youtuberName?: string;
  viewCount?: string;
  uploadTime?: string;
  duration?: string;
}

export default function PlaceCard({
  id,
  title,
  description,
  image,
  videoId,
  category,
  youtuberCount,
  distance,
  rating,
  youtuberName,
  viewCount,
  uploadTime,
  duration
}: PlaceCardProps) {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [visited, setVisited] = useLocalStorage<string[]>('visited', []);

  const isFavorited = favorites.includes(id);
  const isVisited = visited.includes(id);

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const toggleVisited = () => {
    if (isVisited) {
      setVisited(visited.filter(visit => visit !== id));
    } else {
      setVisited([...visited, id]);
    }
  };

  return (
    <Link href={`/place/${id}`} className="block">
      <div className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors">
        <div className="relative">
          <img src={image} alt={title} className="w-full aspect-video object-cover" />
          {videoId && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
              {duration}
            </div>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite();
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">{title}</h3>
          {youtuberName && (
            <p className="text-xs text-gray-400 mb-1">{youtuberName}</p>
          )}
          {(viewCount || uploadTime || distance) && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {viewCount && <span>{viewCount}</span>}
              {viewCount && uploadTime && <span>•</span>}
              {uploadTime && <span>{uploadTime}</span>}
              {uploadTime && distance && <span>•</span>}
              {distance && <span>📍 {distance}</span>}
            </div>
          )}
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs bg-gradient-to-r from-pink-400 to-pink-500 text-white px-2 py-0.5 rounded flex items-center gap-1">
              <span className="text-xs">🐷</span>
              <span>유튜버 {youtuberCount}명 방문</span>
            </span>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 