'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

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
    // const router = useRouter(); // No longer needed here

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-md mx-auto p-4">

                <div className="relative flex items-center justify-center pt-4 pb-4">
                    <BackButton />
                    <h1 className="text-3xl font-bold text-center">
                        Help & Support
                    </h1>
                </div>

                {/* FAQ Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl">Frequently Asked Questions (FAQ)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Contact & Legal Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Support</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Couldn't find what you were looking for? Reach out to our dedicated support team.
                            </p>
                            <Link href="mailto:sertactoroz@gmail.com" passHref legacyBehavior>
                                <Button className="w-full">Send an Email</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Legal & About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p>Version: v{APP_VERSION}</p>
                            <Link href="/privacy" className="text-primary hover:underline block">Privacy Policy</Link>
                            <Link href="/terms" className="text-primary hover:underline block">Terms of Service</Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}