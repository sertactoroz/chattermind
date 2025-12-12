'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import BackButton from '@/features/common/components/BackButton';

import { useTheme } from 'next-themes';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl'; // useTranslations'ı ekledik

const LOCALES = [
    // Bu array JSON'a taşınmamalı, uygulama mantığı için burada kalmalı,
    // ancak label ve name alanları çeviri anahtarı olarak kullanılabilir.
    { code: 'tr', label: 'TR', nameKey: 'turkish' },
    { code: 'en', label: 'EN', nameKey: 'english' },
    { code: 'de', 'label': 'DE', nameKey: 'german' },
];

export default function SettingsPage() {
    const t = useTranslations('Settings'); // Translations initialization

    // --- Language Switcher Hooks ---
    const currentLocale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    // --- Theme Toggle Hooks ---
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    // Determine the theme to display in the Select component
    const displayTheme = theme === 'system' ? 'system' : (resolvedTheme || 'light');
    // -----------------------------

    // Mock States for local settings
    const [notifications, setNotifications] = useState(true);

    const handleThemeChange = (value: string) => {
        setTheme(value);
        // Toast message using translation keys
        toast.info(t('toast_theme_changed', { theme: t(`theme_${value}`) }));
    };

    const handleLanguageChange = async (newLocale: string) => {
        if (newLocale === currentLocale) return;

        const localeName = LOCALES.find(l => l.code === newLocale)?.nameKey;

        // Logic copied from LanguageSwitcher: replace path with new locale
        await router.replace(pathname, { locale: newLocale });
        router.refresh();

        // Toast message using translation keys
        toast.info(t('toast_language_changed', { language: t(`language_${localeName}`) }));
    };

    const handleGoToDataPrivacy = () => {
        // Navigate the user to the new DataPrivacyPage.
        // NOTE: Adjust the path '/data-privacy' to match your application's actual route structure.
        router.push('/data-privacy');
    };


    return (
        <div className="max-w-md mx-auto p-4">
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-center">{t('title')}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('general_title')}</CardTitle>
                    <CardDescription>{t('general_description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Theme Selector (Using next-themes logic) */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="theme">{t('label_theme')}</Label>
                        {!mounted ? (
                            <div className="w-[180px] h-10 bg-muted rounded-md animate-pulse" />
                        ) : (
                            <Select value={displayTheme} onValueChange={handleThemeChange}>
                                <SelectTrigger id="theme" className="w-[180px]">
                                    <SelectValue placeholder={t('select_theme_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">{t('theme_light')}</SelectItem>
                                    <SelectItem value="dark">{t('theme_dark')}</SelectItem>
                                    <SelectItem value="system">{t('theme_system')}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Language Selector (Using next-intl logic) */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="language">{t('label_language')}</Label>
                        <Select value={currentLocale} onValueChange={handleLanguageChange}>
                            <SelectTrigger id="language" className="w-[180px]">
                                <SelectValue placeholder={t('select_language_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {LOCALES.map(l => (
                                    <SelectItem key={l.code} value={l.code}>
                                        {t(`language_${l.nameKey}`)} ({l.label})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">{t('label_notifications')}</Label>
                        <Switch
                            id="notifications"
                            checked={notifications}
                            onCheckedChange={setNotifications}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}