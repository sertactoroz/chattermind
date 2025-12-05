'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// ... (AuthContextType ve AuthContext tanımları aynı kalır)

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
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Load existing session and redirect if user exists
    useEffect(() => {
        const guestId = localStorage.getItem("guest_user_id");
        if (guestId) {
            setUser({ id: guestId, email: null, role: "guest" } as any);
            setLoading(false);
            // Guest ID varsa, doğrudan karakter sayfasına yönlendir
            router.replace('/characters');
            return;
        }

        const init = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);
            setLoading(false);

            // Supabase session varsa, karakter sayfasına yönlendir
            if (data.session) {
                router.replace('/characters');
            }
        };
        init();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ?? null);
            setUser(session?.user ?? null);

            // Supabase Auth state değiştiğinde ve yeni bir oturum oluştuğunda yönlendir
            if (session && session.user) {
                router.replace('/characters');
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    // Google sign-in
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/characters` } // ✅ Başarılıysa doğrudan /characters'a dönecek
            });

            if (error) throw error;
            // Google OAuth, yönlendirmeyi kendisi hallettiği için burada ekstra router.push() GEREKMEZ.
            // options: { redirectTo: ... } bunu halleder.

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
            toast.success('Guest account created and saved to DB');

            // ✅ Guest kaydı ve state güncellemesi BAŞARILI oldu. Yönlendir.
            router.push('/characters');

        } catch (err) {
            toast.error('Guest creation failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        // 1. Supabase Oturumunu Sonlandır
        await supabase.auth.signOut();

        // 2. GUEST OTURUMUNU TEMİZLE (Çözüm burada!)
        localStorage.removeItem("guest_user_id");

        // 3. Kullanıcı state'ini temizle (Opsiyonel, ama iyi bir uygulama)
        setUser(null);
        setSession(null);

        // 4. Ana Sayfaya Yönlendir
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