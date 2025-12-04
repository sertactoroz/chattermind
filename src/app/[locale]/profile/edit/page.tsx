'use client';

import { SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import BackButton from '@/features/common/components/BackButton';

// TODO: Mock user data - in a real app, fetch this from context or API
const mockUser = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "/default-avatar.png"
};

export default function EditProfilePage() {
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
            toast.success("Profile updated successfully!", { description: `New name: ${name}` });
            // Optionally update mockUser/context state here
        }, 1500);
    };

    // Placeholder function for avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // In a real app, you would upload this file to a service like S3/Firebase
            // For now, we'll just show a success message.
            toast.info("Avatar upload feature is under development.", { description: "Simulating successful update." });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-md mx-auto p-4">

                <div className="relative flex items-center justify-center pt-4 pb-4">
                    <BackButton />
                    <h1 className="text-3xl font-bold text-center">
                        Edit Profile
                    </h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Public Information</CardTitle>
                        <CardDescription>Update your name and profile picture.</CardDescription>
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
                                    <span>Change Avatar</span>
                                </Button>
                                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </Label>
                        </div>

                        <form onSubmit={handleSaveChanges} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setName(e.target.value)}
                                    placeholder="Your Full Name"
                                />
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <Label htmlFor="email">Email Address</Label>
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
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Change Card */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Password Management</CardTitle>
                        <CardDescription>Secure your account with a strong password.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" onClick={() => toast.info("Password reset feature coming soon!")}>
                            Change Password
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}