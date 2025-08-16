// app/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext'; // src 폴더 사용 시 경로 수정
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 끝나면 (사용자 정보 확인이 완료되면)
    if (!loading) {
      if (user) {
        // 로그인한 사용자는 대시보드로 이동
        router.push('/dashboard');
      } else {
        // 로그인하지 않은 사용자는 로그인 페이지로 이동
        router.push('/signin');
      }
    }
  }, [user, loading, router]);

  // 사용자 정보를 확인하는 동안 로딩 화면을 보여줌
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Loading...</h1>
    </div>
  );
}