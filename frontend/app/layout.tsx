import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '돼동여지도 - 유튜브 맛집을 직접 방문해보세요',
    template: '%s | 돼동여지도'
  },
  description: '유튜버들이 추천하는 맛집을 찾아보세요. 돼동여지도에서 진짜 맛집을 발견하세요.',
  keywords: ['맛집', '유튜브', '맛집추천', '음식점', '리뷰'],
  authors: [{ name: '돼동여지도 팀' }],
  creator: '돼동여지도',
  publisher: '돼동여지도',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://your-domain.com',
    title: '돼동여지도 - 유튜브 맛집을 직접 방문해보세요',
    description: '유튜버들이 추천하는 맛집을 찾아보세요. 돼동여지도에서 진짜 맛집을 발견하세요.',
    siteName: '돼동여지도',
  },
  twitter: {
    card: 'summary_large_image',
    title: '돼동여지도 - 유튜브 맛집을 직접 방문해보세요',
    description: '유튜버들이 추천하는 맛집을 찾아보세요. 돼동여지도에서 진짜 맛집을 발견하세요.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}