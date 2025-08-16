// app/(public)/signin/page.tsx
'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
    const { user, loading } = useAuth(); // 더 이상 idToken을 사용하지 않습니다.
    const router = useRouter();

    // 사용자가 성공적으로 로드되면(로그인되면) 대시보드로 리디렉션합니다.
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // 팝업 후 AuthContext의 onAuthStateChanged가 실행되고,
            // 위의 useEffect가 리디렉션을 처리합니다.
        } catch (error) {
            console.error("Google 로그인 실패:", error);
        }
    };

    // 인증 상태를 확인 중이거나 이미 로그인하여 리디렉션 중일 때 로딩 화면을 표시합니다.
    if (loading || user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>로그인 처리 중...</div>
            </div>
        );
    }

    // 로딩 중이 아니고 사용자가 없을 때 로그인 버튼을 렌더링합니다.
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
            <h1>퀴즈 앱에 오신 것을 환영합니다!</h1>
            <button
                onClick={handleSignIn}
                style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
                Google 계정으로 로그인하기
            </button>
        </div>
    );
}
