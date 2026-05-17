'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import BackButton from '@/features/common/components/BackButton';
import { useTranslations } from 'next-intl';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { api } from '@/lib/api';

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

export default function EditProfilePage() {
    const t = useTranslations('EditProfile');
    const { user, refreshUser } = useAuthContext();
    const [name, setName] = useState(user?.fullName || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '/default-avatar.png');
    const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const avatarToSend = pendingAvatar || avatarUrl;
            await api.put('/api/user/profile', { displayName: name, avatarUrl: avatarToSend });
            setPendingAvatar(null);
            await refreshUser();
            toast.success(t('toast_success', { name }));
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setPasswordLoading(true);
        try {
            await api.put('/api/user/password', { currentPassword, newPassword });
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be smaller than 5MB');
                return;
            }
            try {
                const base64 = await resizeImage(file, 200);
                setAvatarUrl(base64);
                setPendingAvatar(base64);
            } catch {
                toast.error('Failed to process image');
            }
        }
    };

    const isGuest = user?.isGuest;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-center">
                    {t('title')}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('publicInfo_title')}</CardTitle>
                    <CardDescription>{t('publicInfo_description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" asChild>
                                <span>{t('button_changeAvatar')}</span>
                            </Button>
                            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </Label>
                    </div>

                    <form onSubmit={handleSaveChanges} className="space-y-4">
                        <div>
                            <Label className="p-1" htmlFor="name">{t('label_fullName')}</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('placeholder_fullName')}
                            />
                        </div>

                        <div>
                            <Label className="p-1" htmlFor="email">{t('label_emailAddress')}</Label>
                            <Input
                                id="email"
                                value={user?.email || ''}
                                type="email"
                                readOnly
                                disabled
                                className="bg-muted/50 cursor-not-allowed"
                            />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? t('button_saving') : t('button_saveChanges')}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {!isGuest && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>{t('password_title')}</CardTitle>
                        <CardDescription>{t('password_description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <Label className="p-1" htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <Label className="p-1" htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <Label className="p-1" htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <CardFooter className="px-0">
                                <Button type="submit" variant="outline" disabled={passwordLoading}>
                                    {passwordLoading ? t('button_saving') : t('button_changePassword')}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
