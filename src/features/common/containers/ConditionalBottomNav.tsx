'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import BottomNav from '../components/BottomNav'; // Assuming BottomNav is in the same directory

/**
 * Conditionally renders the BottomNav component based on the user's authentication status.
 * It uses the useAuthContext hook to access the user object.
 */
export default function ConditionalBottomNav() {
    const { user, loading } = useAuthContext();

    // Do not render BottomNav if still loading the user state or if no user is logged in.
    if (loading || !user) {
        return null;
    }

    // Render BottomNav if the user is authenticated.
    return <BottomNav />;
}