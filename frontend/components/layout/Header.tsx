'use client'

import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">🐷</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">🔍</span>
              </div>
            </div>
            <span className="text-pink-300 font-bold text-xl tracking-wide">돼동여지도</span>
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/map" className="text-gray-300 hover:text-white transition-colors">
              지도
            </Link>
            <Link href="/favorites" className="text-gray-300 hover:text-white transition-colors">
              즐겨찾기
            </Link>
            <Link href="/history" className="text-gray-300 hover:text-white transition-colors">
              히스토리
            </Link>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}