'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            // Get the initial session data
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;
            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);
            setLoading(false);
        })();

        // onAuthStateChange callback: (event, session)
        const { data: subscriptionData } = supabase.auth.onAuthStateChange((event, session) => {
            // The session parameter comes directly (or is null)
            setSession(session ?? null);
            setUser(session?.user ?? null);
        });

        // cleanup: unsubscribe
        return () => {
            mounted = false;
            // It could be subscriptionData, if it exists, unsubscribe

            try {
                subscriptionData?.subscription?.unsubscribe();
            } catch (err) {
                // ignore
            }
        };
    }, []);

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin },
            });
        } catch (err) {
            console.error('Google sign-in error', err);
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
};
