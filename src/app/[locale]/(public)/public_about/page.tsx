'use client';

import { Card, CardContent } from '@/components/ui/card';

import BackButton from '@/features/common/components/BackButton';
import { useTranslations } from 'next-intl';


const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'vX.X.X';
export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-center">
                    {t('title')}
                </h1>
            </div>

            {/* Contact & Legal Section */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-center">
                <Card>
                    <CardContent className="space-y-3 text-sm">
                        <p>
                            <strong>{t('appName')}</strong> {t('p1_part1')}
                            <br />
                            {t('p1_part2')}
                        </p>

                        <p>
                            {t('p2_part1')} <strong>Next.js App Router</strong>,
                            <strong> Supabase</strong> {t('p2_part2')}
                            <strong> Groq LLM</strong> {t('p2_part3')}
                            <strong>Framer Motion</strong> {t('p2_part4')}
                        </p>
                        <p>
                            {t('p3_part1')}
                            <br />
                            <a href="https://github.com/sertactoroz/chattermind" target="_blank" rel="noopener noreferrer"
                                className="text-primary hover:underline font-semibold block mt-1">
                                {t('viewGithub')}
                            </a>
                        </p>

                        <p className='text-gray-500'>{t('version')}: {APP_VERSION}</p>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}