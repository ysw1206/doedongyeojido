'use client'

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // 현재 페이지가 지도 페이지인지 확인
  const isMapMode = pathname === '/map';
  
  // 지도 페이지에서는 SearchSection을 보여주지 않음
  const showSearchSection = pathname !== '/map';

  const handleLocationClick = () => {
    setLocationModalOpen(true);
  };

  const handleMapToggle = () => {
    console.log('지도 토글 클릭');
    
    const nextPath = isMapMode ? '/' : '/map';
    router.push(nextPath);    
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        onLocationClick={handleLocationClick}
        onMapToggle={handleMapToggle}
        isMapMode={isMapMode}
        showSearchSection={showSearchSection}
      />
      
      {/* 지도 페이지는 pt-16 없이, 다른 페이지는 pt-16 적용 */}
      <main className={isMapMode ? "" : "pt-16"}>
        {children}
      </main>

      {/* Footer는 지도 페이지에서는 제외 */}
      {!isMapMode && <Footer />}
    </div>
  );
}