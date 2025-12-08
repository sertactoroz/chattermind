'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import Header from '../components/Header';

/**
 * Conditionally renders the Header component based on the user's authentication status.
 * It uses the useAuthContext hook to access the user object.
 */
export default function ConditionalHeader() {
    const { user, loading } = useAuthContext();

    // Do not render Header if still loading the user state or if no user is logged in.
    if (loading || !user) {
        return null;
    }

    // Render Header if the user is authenticated.
    return <Header />;
}