'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, use } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface UserProfile {
    id: string;
    firebaseUid: string;
    nickname: string | null;
    ticketBalance: number;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const token = await user.getIdToken();
                    const response = await fetch('/api/user/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch user profile');
                    }
                    const profileData: UserProfile = await response.json();
                    setUserProfile(profileData);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserProfile(null);
                }
                finally {
                    setLoading(false);
                }
            } else {
                setUser(null);
                setUserProfile(null);
                setLoading(false);
            }

        });
        return () => unsubscribe();
    }, []);

    const value = { user, userProfile: userProfile, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    return useContext(AuthContext);
};