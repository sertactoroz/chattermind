'use client';

import { SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import BackButton from '@/features/common/components/BackButton';
import { useTranslations } from 'next-intl';

// TODO: Mock user data - in a real app, fetch this from context or API
const mockUser = {
    fullName: "Guest User",
    email: "guest.user@example.com",
    avatarUrl: "/default-avatar.png"
};

export default function EditProfilePage() {
    const t = useTranslations('EditProfile');
    const [name, setName] = useState(mockUser.fullName);
    const [avatarUrl, setAvatarUrl] = useState(mockUser.avatarUrl);
    const [loading, setLoading] = useState(false);

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // In a real app, this is where you'd call your updateProfile API
            toast.success(t('toast_success', { name: name }), { description: t('toast_success_desc', { name: name }) });
            // Optionally update mockUser/context state here
        }, 1500);
    };

    // Placeholder function for avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 1. In a real app, you would upload the file to a server/service
            //    and get a new URL back, then call setAvatarUrl(newUrl).

            // 2. To fix the linter error and simulate a change locally:
            const newAvatarUrl = URL.createObjectURL(file); // Create a temporary URL for immediate display

            // *** CALL setAvatarUrl HERE ***
            setAvatarUrl(newAvatarUrl);

            toast.info(t('toast_avatarSimulated_title'), { description: t('toast_avatarSimulated_desc') });
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
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
                    {/* Avatar Upload Section */}
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
                                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setName(e.target.value)}
                                placeholder={t('placeholder_fullName')}
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <Label className="p-1" htmlFor="email">{t('label_emailAddress')}</Label>
                            <Input
                                id="email"
                                value={mockUser.email}
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

            {/* Password Change Card */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>{t('password_title')}</CardTitle>
                    <CardDescription>{t('password_description')}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline" onClick={() => toast.info(t('toast_passwordFeatureComing'))}>
                        {t('button_changePassword')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}