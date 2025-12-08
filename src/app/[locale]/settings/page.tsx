'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import BackButton from '@/features/common/components/BackButton';

import { useTheme } from 'next-themes'; // From ThemeToggle
import { usePathname, useRouter } from '@/i18n/navigation'; // From LanguageSwitcher
import { useLocale } from 'next-intl'; // From LanguageSwitcher

const LOCALES = [
    { code: 'tr', label: 'TR', name: 'Türkçe' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'de', 'label': 'DE', name: 'Deutsch' },
];
// --------------------------------------------------

export default function SettingsPage() {
    // --- Language Switcher Hooks ---
    const currentLocale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    // --- Theme Toggle Hooks ---
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    // Use the theme value that should be displayed in the Select component
    const displayTheme = theme === 'system' ? 'system' : (resolvedTheme || 'light');
    // -----------------------------

    // Mock States for local settings
    const [notifications, setNotifications] = useState(true);

    const handleThemeChange = (value: string) => {
        setTheme(value);
        toast.info(`Theme set to ${value}.`);
    };

    const handleLanguageChange = async (newLocale: string) => {
        if (newLocale === currentLocale) return;
        // Logic copied from LanguageSwitcher
        await router.replace(pathname, { locale: newLocale });
        router.refresh();
        toast.info(`Language set to ${LOCALES.find(l => l.code === newLocale)?.name || newLocale}.`);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
            toast.error("Account deletion requested. Simulating API call...", { duration: 3000 });
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-center">Settings & Privacy</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure your application experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Theme Selector (Using next-themes logic) */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="theme">Application Theme</Label>
                        {/* Guard against unmounted state for next-themes */}
                        {!mounted ? (
                            <div className="w-[180px] h-10 bg-muted rounded-md animate-pulse" />
                        ) : (
                            <Select value={displayTheme} onValueChange={handleThemeChange}>
                                <SelectTrigger id="theme" className="w-[180px]">
                                    <SelectValue placeholder="Select Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System Default</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Language Selector (Using next-intl logic) */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="language">Application Language</Label>
                        <Select value={currentLocale} onValueChange={handleLanguageChange}>
                            <SelectTrigger id="language" className="w-[180px]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {LOCALES.map(l => (
                                    <SelectItem key={l.code} value={l.code}>
                                        {l.name} ({l.label})
                                    </SelectItem>
                                ))}
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
                        className="w-full text-destructive border-destructive hover:bg-destructive/10"
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
    );
}