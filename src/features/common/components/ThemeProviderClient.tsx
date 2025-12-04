'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"      // attribute="class" => <html class="dark"> toggles; defaultTheme 'system' or 'light'
            defaultTheme="system"  // default: system;"
            enableSystem={true}
            storageKey="theme"     // localStorage key
        >
            {children}
        </ThemeProvider>
    );
}
