'use client';

import React, { useState, useRef, useMemo } from 'react';
import CompanionCard from './CompanionCard';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useCompanions } from '@/features/companions/hooks/useCompanions';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import CompanionFormDialog from './CompanionFormDialog';
import { userCompanionService } from '@/features/companions/services/userCompanionService';
import type { Companion } from '@/features/companions/types/companion.types';
import { toast } from 'sonner';

export default function CompanionList() {
    const t = useTranslations('CompanionList');
    const { allCompanions, isLoading, refresh } = useCompanions();
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const buttonRef = useRef<HTMLDivElement>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCompanion, setEditingCompanion] = useState<Companion | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const isUserCompanion = (c: Companion) => c.id.startsWith('user_');

    const systemCompanions = useMemo(() => allCompanions.filter(c => !isUserCompanion(c)), [allCompanions]);
    const userCompanions = useMemo(() => allCompanions.filter(c => isUserCompanion(c)), [allCompanions]);

    const handleSelect = (id: string) => {
        setSelected(id);
        setTimeout(() => {
            if (buttonRef.current) {
                buttonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const handleStartChat = () => {
        if (!selected) {
            alert(t('alert_selectCompanion'));
            return;
        }
        setLoading(true);
        setTimeout(() => {
            router.push(`/chat/new?character=${selected}`);
        }, 500);
    };

    const handleCreate = () => {
        setEditingCompanion(null);
        setDialogOpen(true);
    };

    const handleEdit = (comp: Companion) => {
        setEditingCompanion(comp);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await userCompanionService.delete(id);
            toast.success('Companion deleted');
            setDeleteConfirm(null);
            refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete');
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 lg:p-6 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-40 mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <Skeleton key={i} className="h-48 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
                <Button onClick={handleCreate} variant="outline" className="gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    Create Companion
                </Button>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    ChatterMind Team
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                    {systemCompanions.map((c) => (
                        <CompanionCard
                            key={c.id}
                            companion={c}
                            onSelect={handleSelect}
                            selected={selected === c.id}
                        />
                    ))}
                </div>
            </div>

            {userCompanions.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        My Companions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                        {userCompanions.map((c) => (
                            <div key={c.id} className="relative group">
                                <CompanionCard
                                    companion={c}
                                    onSelect={handleSelect}
                                    selected={selected === c.id}
                                />
                                <div className="absolute top-1 right-1 z-20 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleEdit(c); }}
                                        className="w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent transition-colors"
                                        aria-label="Edit companion"
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </button>
                                    {deleteConfirm === c.id ? (
                                        <div className="flex gap-0.5">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                                                className="w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[9px] font-bold"
                                            >
                                                OK
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                                                className="w-7 h-7 rounded-full bg-background/80 border border-border flex items-center justify-center text-[9px]"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(c.id); }}
                                            className="w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive/10 transition-colors"
                                            aria-label="Delete companion"
                                        >
                                            <Trash2 className="w-3 h-3 text-destructive" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div ref={buttonRef} className="flex gap-3">
                <Button
                    onClick={handleStartChat}
                    className="flex-1 bg-brand-500 text-foreground dark:bg-brand-500 dark:text-gray-100
                                h-10 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center cursor-pointer 
                                transition-colors hover:bg-brand-600 dark:hover:bg-brand-400"
                    disabled={!selected || loading}
                >
                    {loading ? t('loading_button') : t('start_chat_button')}
                </Button>
            </div>

            <CompanionFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingCompanion={editingCompanion}
                onSaved={refresh}
            />
        </div>
    );
}
