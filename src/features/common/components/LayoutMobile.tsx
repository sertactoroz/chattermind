'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export const SiteHeader: React.FC = () => {
    return (
        <header className="w-full bg-white/60 backdrop-blur-sm border-b border-slate-100">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/chattermind-logo.svg" alt="ChatterMind" className="h-8 w-auto" />
                    <div className="text-sm font-medium">ChatterMind</div>
                </div>
                <div>
                    <Button size="sm" variant="ghost" onClick={() => window.location.reload()}>
                        Refresh
                    </Button>
                </div>
            </div>
        </header>
    );
};
