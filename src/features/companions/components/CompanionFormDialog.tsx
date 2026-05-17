'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Companion } from '@/features/companions/types/companion.types';
import { userCompanionService } from '@/features/companions/services/userCompanionService';

type FormData = {
    name: string;
    role: string;
    avatar: string;
    description: string;
    language: string;
    systemPrompt: string;
};

const emptyForm: FormData = {
    name: '',
    role: '',
    avatar: '',
    description: '',
    language: '',
    systemPrompt: '',
};

function resizeImage(file: File, maxSize = 200): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            if (width > height) {
                if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
            } else {
                if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject(new Error('No canvas context')); return; }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

export default function CompanionFormDialog({
    open,
    onOpenChange,
    editingCompanion,
    onSaved,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingCompanion?: Companion | null;
    onSaved: () => void;
}) {
    const isEdit = !!editingCompanion;
    const [form, setForm] = useState<FormData>(
        editingCompanion
            ? {
                name: editingCompanion.name,
                role: editingCompanion.role || '',
                avatar: editingCompanion.avatar || '',
                description: editingCompanion.description || '',
                language: editingCompanion.language || '',
                systemPrompt: editingCompanion.systemPrompt || '',
            }
            : emptyForm
    );
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            setForm(
                editingCompanion
                    ? {
                        name: editingCompanion.name,
                        role: editingCompanion.role || '',
                        avatar: editingCompanion.avatar || '',
                        description: editingCompanion.description || '',
                        language: editingCompanion.language || '',
                        systemPrompt: editingCompanion.systemPrompt || '',
                    }
                    : emptyForm
            );
        }
    }, [open, editingCompanion]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be smaller than 5MB');
                return;
            }
            try {
                const base64 = await resizeImage(file, 200);
                setForm(f => ({ ...f, avatar: base64 }));
            } catch {
                toast.error('Failed to process image');
            }
        }
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.role.trim()) {
            toast.error('Name and Role are required');
            return;
        }
        if (!form.systemPrompt.trim()) {
            toast.error('System Prompt is required');
            return;
        }

        setSaving(true);
        try {
            if (isEdit && editingCompanion) {
                await userCompanionService.update(editingCompanion.id, form);
                toast.success('Companion updated');
            } else {
                await userCompanionService.create(form);
                toast.success('Companion created');
            }
            onOpenChange(false);
            onSaved();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to save companion');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Companion' : 'Create Companion'}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {isEdit ? 'Edit your companion details' : 'Create a new AI companion'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="shrink-0 w-16 h-16 rounded-full border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center overflow-hidden transition-colors"
                        >
                            {form.avatar ? (
                                <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="text-xs text-muted-foreground">Upload</span>
                            )}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="comp-name">Name</Label>
                            <Input
                                id="comp-name"
                                placeholder="e.g. Maria"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="comp-role">Role</Label>
                        <Input
                            id="comp-role"
                            placeholder="e.g. Spanish Teacher"
                            value={form.role}
                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="comp-language">Language</Label>
                        <Input
                            id="comp-language"
                            placeholder="e.g. Spanish (leave empty for English)"
                            value={form.language}
                            onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="comp-desc">Description</Label>
                        <Input
                            id="comp-desc"
                            placeholder="Short description"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="comp-prompt">System Prompt</Label>
                        <textarea
                            id="comp-prompt"
                            className="w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="How should this companion behave? What personality, tone, rules?"
                            value={form.systemPrompt}
                            onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
