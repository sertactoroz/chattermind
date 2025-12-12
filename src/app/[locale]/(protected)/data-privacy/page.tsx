'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import BackButton from '@/features/common/components/BackButton';
import { useTranslations } from 'next-intl';

export default function DataPrivacyPage() {
    const t = useTranslations('DataPrivacy');

    // Handler for simulating account deletion
    const handleDeleteAccount = () => {
        if (window.confirm(t('confirm_deleteAccount'))) {
            // In a real application, an API call would be made here
            toast.error(t('toast_accountDeletion'), { duration: 3000 });
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            {/* Page Title and Back Button */}
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-center">{t('title')}</h1>
            </div>

            {/* Privacy and Data Card */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>{t('card_title')}</CardTitle>
                    <CardDescription>{t('card_description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Clear History Button */}
                    <Button
                        variant="outline"
                        className="w-full text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => toast.info(t('toast_historyCleared'))}
                    >
                        {t('button_clearHistory')}
                    </Button>

                    {/* Download Data Button */}
                    <Button variant="outline" className="w-full" onClick={() => toast.info(t('toast_dataDownloaded'))}>
                        {t('button_downloadData')}
                    </Button>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{t('footer_irreversibleNote')}</p>
                    {/* Delete Account Button */}
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                        {t('button_deleteAccount')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}