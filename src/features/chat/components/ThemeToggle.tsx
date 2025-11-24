'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    // resolvedTheme is client-only; theme may be 'system'|'dark'|'light'
    const current = resolvedTheme || theme; // generally resolvedTheme after mount

    // until mounted, resolvedTheme may be undefined; guard rendering
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button className={cn('p-1 w-10 h-10 flex items-center justify-center', className)} variant="ghost" size="sm" disabled>
                <div className="w-4 h-4" />
            </Button>
        );
    }

    const toggle = () => {
        setTheme(current === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button onClick={toggle} aria-label="Toggle theme" className={cn('p-1 w-10 h-10 flex items-center justify-center', className)} variant="ghost" size="sm">
            {current === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
    );
}
