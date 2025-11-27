// app/settings/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPage() {
    // Mock States
    const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
    const [notifications, setNotifications] = useState(true);

    const handleThemeChange = (value: string) => {
        setTheme(value);
        // In a real app, this is where you'd change the theme (e.g., using next-themes)
        toast.info(`Theme set to ${value}.`);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
            // Simulate account deletion
            toast.error("Account deletion requested. Simulating API call...", { duration: 3000 });
            // In a real app, redirect to a confirmation page or call a sign-out/delete API
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-md mx-auto p-4">

                <h1 className="text-3xl font-bold mb-6 mt-4">Settings & Privacy</h1>
                {/* General Settings Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Configure your application experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Theme Selector */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="theme">Application Theme</Label>
                            <Select value={theme} onValueChange={handleThemeChange}>
                                <SelectTrigger id="theme" className="w-[180px]">
                                    <SelectValue placeholder="Select Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System Default</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Notifications Toggle */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notifications">Receive Chat Notifications</Label>
                            <Switch
                                id="notifications"
                                checked={notifications}
                                onCheckedChange={setNotifications}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy and Data Card */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Data & Privacy</CardTitle>
                        <CardDescription>Manage your data, history, and security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Clear History */}
                        <Button
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => toast.info("Chat history cleared (simulated).")}
                        >
                            Clear All Chat History
                        </Button>

                        {/* Download Data */}
                        <Button variant="outline" className="w-full" onClick={() => toast.info("Data download link sent to email (simulated).")}>
                            Download My Data
                        </Button>
                    </CardContent>
                    <CardFooter className="border-t pt-6 flex justify-end">
                        {/* Delete Account */}
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}