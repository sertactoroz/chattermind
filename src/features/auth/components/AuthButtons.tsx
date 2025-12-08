'use client';

import React, { useState } from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

import { FcGoogle } from 'react-icons/fc';
import { IoPersonOutline } from 'react-icons/io5';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// 💡 Define Provider type only for active methods: Google and Guest
type Provider = 'google' | 'guest' | null;

export function AuthButtons() {
    const {
        user,
        loading, // General loading state from AuthProvider
        signInWithGoogle,
        signInAsGuest
    } = useAuthContext();

    // State to track which specific provider started the loading process
    const [loadingProvider, setLoadingProvider] = useState<Provider>(null);

    // Email modal/form logic removed as per request

    const t = useTranslations('Auth');

    // Helper component for the spinner
    const ButtonSpinner = () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

    // 💡 Wrapper function to handle Google sign-in and set loading state
    const handleGoogleSignIn = async () => {
        setLoadingProvider('google');
        // Note: The AuthProvider's 'loading' state will also become true here.
        await signInWithGoogle();
        // Reset loadingProvider if sign-in fails quickly or before redirection
        // The listener in AuthProvider usually handles the final loading reset.
        if (!loading && !user) {
            setLoadingProvider(null);
        }
    };

    // 💡 Wrapper function to handle Guest sign-in and set loading state
    const handleGuestSignIn = async () => {
        setLoadingProvider('guest');
        await signInAsGuest();
        // Reset loadingProvider if sign-in fails quickly
        if (!loading && !user) {
            setLoadingProvider(null);
        }
    };

    // If user is logged in, show nothing
    if (user) {
        return null;
    }

    // If the general loading state is active, but we didn't initiate it from here 
    // (e.g., initial load or redirect), show a generic spinner
    if (loading && loadingProvider === null) {
        return (
            <div className="flex flex-col space-y-3 w-full">
                {/* 1. Google Sign In Button - Skeleton */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* 'OR' Separator - Skeleton */}
                <div className="relative flex items-center my-3">
                    <Skeleton className="flex-1 h-px w-auto" />
                    <div className="relative flex items-center text-sm text-muted-foreground ">
                        <div className="flex-1 h-px bg-border" />

                        <span className="px-6 font-medium">
                            {t('or') || 'OR'}
                        </span>
                        <div className="flex-1 h-px bg-border" />

                    </div>
                    <Skeleton className="flex-1 h-px w-auto" />
                </div>
                {/* 2. Continue as Guest Button - Skeleton */}
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-3 w-full">

            {/* 1. Google Sign In Button */}
            <Button
                className="w-full h-12 flex items-center justify-center space-x-3 
                        text-base font-semibold border-2 border-primary/20 bg-background 
                        hover:bg-accent hover:text-accent-foreground text-foreground shadow-lg"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loadingProvider !== null && loadingProvider !== 'google'}
            >
                {(loading && loadingProvider === 'google') ? (
                    <ButtonSpinner />
                ) : (
                    <FcGoogle className="w-6 h-6" />
                )}
                <span>{t('signin_google') || 'Sign in with Google'}</span>
            </Button>

            <div className="relative flex items-center text-sm text-muted-foreground my-3">
                <div className="flex-1 h-px bg-border" />


                <span className="px-6 font-medium">
                    {t('or') || 'OR'}
                </span>

                <div className="flex-1 h-px bg-border" />

            </div>

            {/* 2. Continue as Guest Button (Previously 3) */}
            <Button
                variant="ghost"
                className="w-full h-12 flex items-center justify-center space-x-2 text-sm text-muted-foreground border border-border/70 hover:bg-foreground/5"
                onClick={handleGuestSignIn}
                disabled={loadingProvider !== null && loadingProvider !== 'guest'}
            >
                {(loading && loadingProvider === 'guest') ? (
                    <ButtonSpinner />
                ) : (
                    <IoPersonOutline className="w-5 h-5" />
                )}
                <span>{t('guest_login') || 'Continue as Guest'}</span>
            </Button>
        </div>
    );
}