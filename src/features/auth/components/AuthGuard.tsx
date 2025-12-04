'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { LoaderPinwheel } from 'lucide-react'; // 💡 LoaderPinwheel simgesini import ediyoruz

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // Destructure user and loading state from the authentication context
    const { user, loading } = useAuthContext();
    const router = useRouter();

    /**
     * Effect hook to handle redirection logic.
     * If authentication is complete (loading is false) and there's no user,
     * redirect to the home page (assuming it's the login/marketing page).
     */
    useEffect(() => {
        if (!loading && !user) {
            router.push('/'); //Redirect to login page
        }
    }, [user, loading, router]);

    // Show the full-screen loading spinner while authentication is in progress or user is not set.
    if (loading || !user) {
        return (
            // Full screen container to center the spinner
            <div className="flex items-center justify-center h-screen w-full bg-background">
                {/* LoaderPinwheel icon is used for the spinner. 
                  animate-spin provides the continuous rotation effect.
                  text-primary applies the primary color from the theme.
                */}
                <LoaderPinwheel
                    className="h-16 w-16 animate-spin text-primary"
                    aria-label="Loading application content"
                />
            </div>
        );
    }

    // Render children only when the user is authenticated and loading is complete
    return <>{children}</>;
}