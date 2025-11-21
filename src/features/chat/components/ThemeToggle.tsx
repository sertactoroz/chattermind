'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

// We keep the state 'undefined' or 'null' until the component starts running.
type Mode = 'light' | 'dark' | undefined;

export default function ThemeToggle({ className }: { className?: string }) {
    // Set the initial mode to 'undefined'. On the server side, this always remains undefined.
    const [mode, setMode] = useState<Mode>(undefined);

    // Has the component mounted? (Is it running in the browser?)
    const [mounted, setMounted] = useState(false);

    // 1. Setting the States (Client Only)
    useEffect(() => {
        setMounted(true);
        let initialMode: 'light' | 'dark' = 'light';

        try {
            const stored = localStorage.getItem('theme');
            if (stored === 'dark' || stored === 'light') {
                initialMode = stored;
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // fallback: prefer system setting
                initialMode = 'dark';
            }
        } catch { }

        // Set the mode after the first render on the client side. This triggers hydration,
        // but React passes the first empty render that must match the server's HTML.
        setMode(initialMode);
    }, []);

    // 2. Applying the Theme Class and Updating LocalStorage
    useEffect(() => {
        if (!mode) return; // Do nothing if mode is not set yet (server render).

        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', mode);
        } catch { }
    }, [mode]);

    const toggle = () => {
        // Do not attempt to toggle if mode is not set yet
        if (!mode) return;
        setMode(m => (m === 'dark' ? 'light' : 'dark'));
    };

    // 3. Render
    // Render placeholder/null before mounted or mode is determined
    if (!mounted || !mode) {
        // This returns an empty button that matches the Server HTML.
        // To preserve dimensions, you can return an empty div/span instead of the icon.
        return (
            <Button
                className={cn('p-1 w-10 h-10 flex items-center justify-center', className)}
                variant="ghost"
                size="sm"
                disabled
            >
                <div className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <Button
            onClick={toggle}
            aria-label="Toggle theme"
            className={cn('p-1 w-10 h-10 flex items-center justify-center', className)}
            variant="ghost"
            size="sm"
        >
            {/* Now the mode is guaranteed to be determined on the client-side. */}
            {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
    );
}