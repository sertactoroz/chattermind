'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (!mounted) return;
                setSession(data.session ?? null);
                setUser(data.session?.user ?? null);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching initial session:', err);
                toast.error('Session loading failed.', {
                    description: 'Could not retrieve user session data.',
                });
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        // Set up listener for auth state changes
        const { data: subscriptionData } = supabase.auth.onAuthStateChange((event, session) => {
            // The session parameter comes directly (or is null)
            setSession(session ?? null);
            setUser(session?.user ?? null);
        });

        // Cleanup function: unsubscribe from auth state changes
        return () => {
            mounted = false;

            try {
                // Removed unused 'err' variable from catch block
                subscriptionData?.subscription?.unsubscribe();
            } catch {
                // ignore
            }
        };
    }, []);

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin },
            });

            if (error) {
                throw error;
            }

            // Note: A successful sign-in usually redirects the user or triggers the onAuthStateChange listener.
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Google sign-in error', err);
            // Show error toast on sign-in failure
            toast.error('Sign In Failed.', {
                description: 'We could not log you in with Google. Please try again.',
            });
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            // Show success toast on sign-out
            toast.info('You have been successfully signed out.', {
                duration: 3000,
            });

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Sign-out error', err);
            // Show error toast on sign-out failure
            toast.error('Sign Out Failed.', {
                description: 'An error occurred during log out. Please try refreshing the page.',
            });
        } finally {
            setLoading(false);
            router.push('/');
        }
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