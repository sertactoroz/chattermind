'use client';

import React, { useState } from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { IoPersonOutline } from 'react-icons/io5';
import { Loader2, Mail, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';

type Provider = 'email' | 'google' | 'guest' | null;

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    );
}

function GoogleSignInButton({
    disabled,
    loading,
    onStart,
    onSettled,
}: {
    disabled: boolean;
    loading: boolean;
    onStart: () => void;
    onSettled: () => void;
}) {
    const { signInWithGoogle } = useAuthContext();
    const t = useTranslations('Auth');
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse: TokenResponse) => {
            try {
                await signInWithGoogle(tokenResponse.access_token);
            } catch (error) {
                console.error('[Google OAuth] Error:', error);
                onSettled();
            }
        },
        onError: (error) => {
            console.error('[Google OAuth] Login error:', error);
            onSettled();
        },
    });

    return (
        <button
            type="button"
            onClick={() => {
                onStart();
                login();
            }}
            disabled={disabled}
            className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-lg border border-border/60 bg-background text-foreground text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50"
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
            <span>{t('signin_google')}</span>
        </button>
    );
}

export function AuthButtons() {
    const {
        user,
        loading,
        googleEnabled,
        signInWithEmail,
        register,
        signInAsGuest
    } = useAuthContext();

    const [loadingProvider, setLoadingProvider] = useState<Provider>(null);
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [showGuestDialog, setShowGuestDialog] = useState(false);

    const t = useTranslations('Auth');

    const ButtonSpinner = () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoadingProvider('email');
        try {
            if (isRegister) {
                await register(email, password, displayName || undefined);
            } else {
                await signInWithEmail(email, password);
            }
        } catch {
            setLoadingProvider(null);
        }
    };

    const handleGuestSignIn = async () => {
        if (!guestName.trim()) return;
        setLoadingProvider('guest');
        try {
            await signInAsGuest(guestName.trim());
            setShowGuestDialog(false);
        } catch {
            setLoadingProvider(null);
        }
    };

    if (user) {
        return null;
    }

    if (loading && loadingProvider === null) {
        return (
            <div className="flex flex-col space-y-3 w-full">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-3 w-full">
            {googleEnabled && (
                <GoogleSignInButton
                    disabled={loadingProvider !== null && loadingProvider !== 'google'}
                    loading={loadingProvider === 'google'}
                    onStart={() => setLoadingProvider('google')}
                    onSettled={() => setLoadingProvider(null)}
                />
            )}

            <button
                type="button"
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-lg border border-border/60 bg-background text-foreground text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer"
            >
                <Mail className="w-4 h-4" />
                <span>{isRegister ? t('register') : t('login')}</span>
                {showEmailForm ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
            </button>

            {showEmailForm && (
                <form onSubmit={handleEmailAuth} className="space-y-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {isRegister && (
                        <div className="space-y-1">
                            <Label htmlFor="displayName" className="text-xs text-muted-foreground">{t('display_name')}</Label>
                            <Input
                                id="displayName"
                                type="text"
                                placeholder="John Doe"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="h-10"
                            />
                        </div>
                    )}
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-xs text-muted-foreground">{t('email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-10"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-xs text-muted-foreground">{t('password')}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="h-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showPassword ? t('hide_password') : t('show_password')}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
                        disabled={loadingProvider !== null && loadingProvider !== 'email'}
                    >
                        {(loadingProvider === 'email') ? <ButtonSpinner /> : null}
                        <span>{isRegister ? t('register') : t('login')}</span>
                    </Button>
                    <button
                        type="button"
                        onClick={() => { setIsRegister(!isRegister); setShowPassword(false); }}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isRegister ? t('already_have_account') + ' ' + t('signin_link') : t('dont_have_account') + ' ' + t('register')}
                    </button>
                </form>
            )}

            <div className="relative flex items-center text-xs text-muted-foreground/50 my-1">
                <div className="flex-1 h-px bg-border" />
            </div>

            <button
                type="button"
                onClick={() => setShowGuestDialog(true)}
                disabled={loadingProvider !== null}
                className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors cursor-pointer disabled:opacity-50"
            >
                <IoPersonOutline className="w-4 h-4" />
                <span>{t('guest_login')}</span>
            </button>

            {showGuestDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-background rounded-xl shadow-2xl border border-border/50 p-6 w-[90vw] max-w-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-semibold text-foreground">{t('guest_dialog_title')}</h3>
                        <p className="text-sm text-muted-foreground">{t('guest_dialog_description')}</p>
                        <Input
                            type="text"
                            placeholder={t('guest_name_placeholder')}
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleGuestSignIn(); }}
                            className="h-10"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => { setShowGuestDialog(false); setGuestName(''); }}
                                disabled={loadingProvider === 'guest'}
                            >
                                {t('guest_dialog_cancel')}
                            </Button>
                            <Button
                                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                                onClick={handleGuestSignIn}
                                disabled={!guestName.trim() || loadingProvider === 'guest'}
                            >
                                {loadingProvider === 'guest' ? <ButtonSpinner /> : t('guest_dialog_continue')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
