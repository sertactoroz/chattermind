'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const hasRedirected = useRef(false); // ✅ Track if we already redirected

    // Load existing session
    useEffect(() => {
        const guestId = localStorage.getItem("guest_user_id");
        if (guestId) {
            setUser({ id: guestId, email: null, role: "guest" } as any);
            setLoading(false);

            // ✅ Only redirect if we're on the homepage (login page)
            if (!hasRedirected.current && pathname === '/') {
                hasRedirected.current = true;
                router.replace('/characters');
            }
            return;
        }

        const init = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);
            setLoading(false);

            // ✅ Only redirect if we're on the homepage (login page)
            if (data.session && !hasRedirected.current && pathname === '/') {
                hasRedirected.current = true;
                router.replace('/characters');
            }
        };
        init();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ?? null);
            setUser(session?.user ?? null);

            // ✅ Only redirect on actual sign-in events, not page reloads
            if (session && session.user && !hasRedirected.current && pathname === '/') {
                hasRedirected.current = true;
                router.replace('/characters');
            }
        });

        return () => listener.subscription.unsubscribe();
    }, [router, pathname]);

    // Google sign-in
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/characters` }
            });

            if (error) throw error;

        } catch (err) {
            console.error(err);
            toast.error("Google sign-in failed");
            setLoading(false);
        }
    };

    // Guest sign-in
    const signInAsGuest = async () => {
        setLoading(true);
        try {
            const randomUuid = uuidv4();

            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: randomUuid,
                    username: 'Guest User',
                    is_guest: true
                })
                .select()
                .single();

            if (error) {
                console.error('Profile insert error', error);
                throw error;
            }

            localStorage.setItem('guest_user_id', data.id);
            setUser({ id: data.id, email: null, role: 'guest' } as any);
            toast.success('Guest account created');

            router.push('/characters');

        } catch (err) {
            toast.error('Guest creation failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        // Sign out from Supabase
        await supabase.auth.signOut();

        // Clear guest session
        localStorage.removeItem("guest_user_id");

        // Clear state
        setUser(null);
        setSession(null);

        // Reset redirect flag
        hasRedirected.current = false;

        // Redirect to homepage
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{ user, session, loading, signInWithGoogle, signInAsGuest, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
    return ctx;
};