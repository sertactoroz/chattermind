'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { adminService, AdminCompanion } from '@/features/companions/services/adminService';
import { Pencil, Trash2, Plus, ShieldCheck } from 'lucide-react';

type FormData = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    description: string;
    language: string;
    systemPrompt: string;
};

const emptyForm: FormData = {
    id: '',
    name: '',
    role: '',
    avatar: '',
    description: '',
    language: '',
    systemPrompt: '',
};

export default function AdminCompanionsPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const [companions, setCompanions] = useState<AdminCompanion[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.isAdmin) {
            router.replace('/companions');
            return;
        }
        loadCompanions();
    }, [user, router]);

    const loadCompanions = async () => {
        setLoading(true);
        try {
            const data = await adminService.listCompanions();
            setCompanions(data);
        } catch {
            toast.error('Failed to load companions');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (comp: AdminCompanion) => {
        setEditingId(comp.id);
        setForm({
            id: comp.id,
            name: comp.name,
            role: comp.role,
            avatar: comp.avatar || '',
            description: comp.description || '',
            language: comp.language || '',
            systemPrompt: comp.systemPrompt || '',
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.role.trim()) {
            toast.error('Name and Role are required');
            return;
        }
        if (!editingId && !form.id.trim()) {
            toast.error('Companion ID is required');
            return;
        }
        if (!form.systemPrompt.trim()) {
            toast.error('System Prompt is required');
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                await adminService.updateCompanion(editingId, {
                    name: form.name,
                    role: form.role,
                    avatar: form.avatar,
                    description: form.description,
                    language: form.language,
                    systemPrompt: form.systemPrompt,
                });
                toast.success('Companion updated');
            } else {
                await adminService.createCompanion({
                    id: form.id,
                    name: form.name,
                    role: form.role,
                    avatar: form.avatar,
                    description: form.description,
                    language: form.language,
                    systemPrompt: form.systemPrompt,
                });
                toast.success('Companion created');
            }
            setDialogOpen(false);
            loadCompanions();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to save companion');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteCompanion(id);
            toast.success('Companion deleted');
            setDeleteConfirm(null);
            loadCompanions();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete companion');
        }
    };

    if (!user?.isAdmin) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Companion Management</h1>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Companion
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? 'Edit Companion' : 'Create Companion'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            {!editingId && (
                                <div>
                                    <Label htmlFor="comp-id">ID</Label>
                                    <Input
                                        id="comp-id"
                                        placeholder="e.g. dr_smith"
                                        value={form.id}
                                        onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Lowercase, underscores only. Cannot be changed later.
                                    </p>
                                </div>
                            )}
                            <div>
                                <Label htmlFor="comp-name">Name</Label>
                                <Input
                                    id="comp-name"
                                    placeholder="e.g. Dr. Smith"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="comp-role">Role</Label>
                                <Input
                                    id="comp-role"
                                    placeholder="e.g. Career Coach"
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="comp-avatar">Avatar URL</Label>
                                <Input
                                    id="comp-avatar"
                                    placeholder="/avatars/dr_smith.png"
                                    value={form.avatar}
                                    onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="comp-language">Language</Label>
                                <Input
                                    id="comp-language"
                                    placeholder="e.g. German, Turkish (leave empty for English)"
                                    value={form.language}
                                    onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="comp-desc">Description</Label>
                                <Input
                                    id="comp-desc"
                                    placeholder="Short description of the companion"
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="comp-prompt">System Prompt</Label>
                                <textarea
                                    id="comp-prompt"
                                    className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Full system prompt for the AI companion..."
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
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : companions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No companions found.</div>
            ) : (
                <div className="space-y-3">
                    {companions.map(comp => (
                        <Card key={comp.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                        {comp.name}
                                        <span className="text-muted-foreground font-normal ml-2 text-sm">
                                            ({comp.id})
                                        </span>
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(comp)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        {deleteConfirm === comp.id ? (
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(comp.id)}
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteConfirm(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteConfirm(comp.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Role:</span>{' '}
                                        {comp.role}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Language:</span>{' '}
                                        {comp.language || 'English (default)'}
                                    </div>
                                    {comp.description && (
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">Description:</span>{' '}
                                            {comp.description}
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <span className="text-muted-foreground">Prompt Key:</span>{' '}
                                        <code className="text-xs bg-muted px-1 rounded">{comp.promptKey}</code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
