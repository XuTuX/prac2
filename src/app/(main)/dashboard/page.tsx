// app/(main)/dashboard/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // useState는 더 이상 필요하지 않습니다.

export default function DashboardPage() {
    // context에서 user, userProfile 및 글로벌 로딩 상태를 가져옵니다.
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();

    // 리디렉션 로직은 그대로 유지되지만, 이제 프로필이 로드될 때까지 loading이 true이므로 더욱 안정적입니다.
    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/signin');
    };

    // 글로벌 로딩 상태가 이제 인증 및 프로필 가져오기를 모두 포함합니다.
    if (loading) {
        return <div>로딩 중...</div>;
    }

    // 로딩이 아닌데 사용자가 없으면 리디렉션이 진행 중인 것입니다.
    if (!user || !userProfile) {
        return <div>로딩 중...</div>; // 또는 에러 컴포넌트
    }

    // --- 간소화된 UI ---
    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2>내 퀴즈 대시보드</h2>
                    <p>{userProfile.nickname || user.displayName || user.email}님, 환영합니다!</p>
                </div>
                <div>
                    {/* context에서 직접 ticketBalance를 사용합니다. */}
                    <p>티켓: {userProfile.ticketBalance}장</p>
                    <button onClick={() => router.push('/profile')} style={{ marginRight: '10px' }}>
                        프로필 수정
                    </button>
                    <button onClick={handleSignOut}>
                        로그아웃
                    </button>
                </div>
            </header>

            <main>
                <button
                    onClick={() => router.push('/create-quiz')}
                    style={{ width: '100%', padding: '15px', fontSize: '18px', marginBottom: '30px', cursor: 'pointer' }}
                >
                    + 새 퀴즈 만들기
                </button>

                <h3>내 퀴즈 목록</h3>
                <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>퀴즈 목록이 여기에 표시됩니다.</p>
                </div>
            </main>
        </div>
    );
}
