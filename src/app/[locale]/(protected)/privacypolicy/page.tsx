'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/features/common/components/BackButton';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
    const t = useTranslations('PrivacyPolicy');

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton href="/help" />
                <h1 className="text-3xl font-bold text-center">
                    {t('title')}
                </h1>
            </div>
            <p className="text-sm text-muted-foreground mb-6 text-center">
                {t('lastUpdated')}: {t('date')}
            </p>
            <section className="space-y-6 text-sm text-foreground">

                <h2 className="text-xl font-semibold mt-4">{t('section1_title')}</h2>
                <p>
                    {t('section1_p1')}
                </p>

                <h2 className="text-xl font-semibold mt-4">{t('section2_title')}</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>**{t('section2_personalData_title')}:** {t('section2_personalData_p1')}</li>
                    <li>**{t('section2_chatData_title')}:** {t('section2_chatData_p1')}</li>
                    <li>**{t('section2_usageData_title')}:** {t('section2_usageData_p1')}</li>
                </ul>

                <h2 className="text-xl font-semibold mt-4">{t('section3_title')}</h2>
                <p>
                    {t('section3_p1')}
                </p>

                <h2 className="text-xl font-semibold mt-4">{t('section4_title')}</h2>
                <p>
                    {t('section4_p1')}
                </p>

                <h2 className="text-xl font-semibold mt-4">{t('section5_title')}</h2>
                <p>
                    {t('section5_p1')}
                </p>
            </section>
            <div className="mt-8 text-center">
                {/* The secondary "Back to Help & Support" link remains */}
                <Link href="/help" passHref legacyBehavior>
                    <Button variant="outline">
                        {t('button_backToHelp')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}