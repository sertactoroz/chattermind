// components/common/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

/**
 * A reusable back button component.
 * If 'href' is provided, it navigates to that hierarchical parent path (e.g., /settings).
 * If 'href' is NOT provided, it defaults to navigating to the previous history entry (router.back()).
 * * @param className Optional additional Tailwind CSS classes.
 * @param href Optional string path for hierarchical navigation (e.g., '/settings').
 */
export default function BackButton({ className = '', href }: { className?: string; href?: string }) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            // 1. Hierarchical navigation: Go to the defined parent path
            router.push(href);
        } else {
            // 2. Default behavior: Go to the previous entry in browser history
            router.back();
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleClick} // Use the new handler
            // Default styling places it absolutely, adjust with props if needed
            className={`absolute left-0 top-1/2 -translate-y-1/2 ${className}`}
            aria-label={href ? `Go to ${href}` : "Go back to the previous page"}
        >
            <ArrowLeft className="h-5 w-5" />
        </Button>
    );
}