'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('로그인 처리 중...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 인증 정보 확인
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('로그인 처리 중 오류가 발생했습니다.');
          
          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
          return;
        }

        if (data.session) {
          console.log('Auth callback success:', data.session.user);
          setStatus('success');
          setMessage('로그인이 완료되었습니다. 메인 페이지로 이동합니다...');
          
          // 1초 후 메인 페이지로 리다이렉트
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          setStatus('error');
          setMessage('인증 세션을 찾을 수 없습니다.');
          
          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setStatus('error');
        setMessage('예상치 못한 오류가 발생했습니다.');
        
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <span className="text-green-600 text-xl">✓</span>
            )}
            {status === 'error' && (
              <span className="text-red-600 text-xl">✕</span>
            )}
          </div>
          
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            {status === 'loading' && '로그인 처리 중'}
            {status === 'success' && '로그인 성공'}
            {status === 'error' && '로그인 실패'}
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>
        </div>

        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="rounded-full bg-gray-300 h-2 w-2"></div>
              <div className="rounded-full bg-gray-300 h-2 w-2"></div>
              <div className="rounded-full bg-gray-300 h-2 w-2"></div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              다시 로그인하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}