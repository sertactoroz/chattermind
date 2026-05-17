'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { api } from '@/lib/api';

type AuthUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
  isAdmin: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();

    if (token) {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!parsed.hasOwnProperty('isAdmin')) parsed.isAdmin = false;
          setUser(parsed);
        } catch {
          api.clearToken();
          localStorage.removeItem('auth_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = useCallback((token: string, userId: string, email: string, fullName?: string | null, avatarUrl?: string | null) => {
    api.setToken(token);
    const authUser: AuthUser = { id: userId, email, fullName: fullName ?? null, avatarUrl: avatarUrl ?? null, isGuest: false, isAdmin: false };
    setUser(authUser);
    localStorage.setItem('auth_user', JSON.stringify(authUser));
    api.get<{ id: string; email: string; displayName: string; avatarUrl: string; isGuest: boolean; isAdmin: boolean }>('/api/user/profile')
      .then(profile => {
        const updated: AuthUser = { id: profile.id, email: profile.email, fullName: profile.displayName, avatarUrl: profile.avatarUrl, isGuest: profile.isGuest, isAdmin: profile.isAdmin };
        setUser(updated);
        localStorage.setItem('auth_user', JSON.stringify(updated));
      })
      .catch(() => {});
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const result = await api.post<{ token: string; userId: string; email: string }>('/api/auth/login', { email, password });
    handleAuthSuccess(result.token, result.userId, result.email);
    toast.success('Logged in successfully');
    router.push('/companions');
  }, [router, handleAuthSuccess]);

  const registerUser = useCallback(async (email: string, password: string, displayName?: string) => {
    const result = await api.post<{ token: string; userId: string; email: string }>('/api/auth/register', { email, password, displayName });
    handleAuthSuccess(result.token, result.userId, result.email, displayName);
    toast.success('Account created successfully');
    router.push('/companions');
  }, [router, handleAuthSuccess]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const result = await api.post<{ token: string; userId: string; email: string; displayName?: string; avatarUrl?: string }>('/api/auth/google', {
          accessToken: tokenResponse.access_token
        });
        handleAuthSuccess(result.token, result.userId, result.email, result.displayName, result.avatarUrl);
        toast.success('Logged in with Google');
        router.replace('/companions');
      } catch (e) {
        console.error('[Google OAuth] Error:', e);
        toast.error('Google sign in failed');
      }
    },
    onError: (err) => {
      console.error('[Google OAuth] Login error:', err);
      toast.error('Google sign in failed');
    },
  });

  const signInWithGoogle = useCallback(async () => {
    googleLogin();
  }, [googleLogin]);

  const signInAsGuest = useCallback(async (displayName: string) => {
    const result = await api.post<{ token: string; userId: string; email: string }>('/api/auth/guest', { displayName });
    const authUser: AuthUser = { id: result.userId, email: result.email, fullName: displayName, avatarUrl: null, isGuest: true, isAdmin: false };
    api.setToken(result.token);
    setUser(authUser);
    localStorage.setItem('auth_user', JSON.stringify(authUser));
    toast.success('Guest account created');
    router.push('/companions');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await api.get<{ id: string; email: string; displayName: string; avatarUrl: string; isGuest: boolean; isAdmin: boolean }>('/api/user/profile');
      const authUser: AuthUser = {
        id: profile.id,
        email: profile.email,
        fullName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        isGuest: profile.isGuest,
        isAdmin: profile.isAdmin,
      };
      setUser(authUser);
      localStorage.setItem('auth_user', JSON.stringify(authUser));
    } catch {
      console.error('Failed to refresh user profile');
    }
  }, []);

  const signOut = useCallback(async () => {
    api.clearToken();
    localStorage.removeItem('guest_user_id');
    localStorage.removeItem('guest_display_name');
    localStorage.removeItem('auth_user');
    setUser(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, register: registerUser, signInWithGoogle, signInAsGuest, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider');
  return ctx;
};
