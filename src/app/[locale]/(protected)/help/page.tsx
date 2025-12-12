'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import BackButton from '@/features/common/components/BackButton';

// TODO: Mock FAQ Data
const faqs = [
    {
        q: "How can I change the character's personality?",
        a: "The character's core personality is set by the system prompt and cannot be changed by the user. You can only start a new chat with a different character."
    },
    {
        q: "Why isn't my chat history syncing?",
        a: "Please ensure you are logged in. If the problem persists, contact our support team with details about your device and browser."
    },
    {
        q: "Is my conversation data confidential?",
        a: "Yes, we treat your conversations with the utmost privacy. For detailed information, please refer to our Privacy Policy linked below."
    },
];


const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'vX.X.X';
export default function HelpPage() {
    const t = useTranslations('Help');

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-center">
                    {t('title')}
                </h1>
            </div>

            {/* FAQ Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-xl">{t('faqTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {/* We use the keys defined in the 'About' section for FAQs */}
                        {faqs.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left font-medium">{t(`faq.${index}.q`)}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {t(`faq.${index}.a`)}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {/* Contact & Legal Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{t('contactTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t('contactDescription')}
                        </p>
                        <a href="mailto:sertactoroz@gmail.com">
                            <Button className="w-full">{t('button_sendEmail')}</Button>
                        </a>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">{t('legalTitle')}</CardTitle>
                    </CardHeader>

                    <CardContent className="h-full flex flex-col justify-between p-6 pt-0">

                        <div className="space-y-3 text-sm flex-grow">
                            <Link href="/privacypolicy" className="text-primary hover:underline block">{t('privacyPolicy')}</Link>
                            <Link href="/terms" className="text-primary hover:underline block">{t('termsOfService')}</Link>
                        </div>

                        <p className='text-gray-500 pt-4'>{t('version')}: {APP_VERSION}</p>

                    </CardContent>
                </Card>
            </div>
        </div>

    );
}