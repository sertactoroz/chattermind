'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/features/common/components/BackButton';

export default function TermsOfServicePage() {

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-md mx-auto p-4">

                <div className="relative flex items-center justify-center pt-4 pb-4">
                    <BackButton href="/help" />
                    <h1 className="text-3xl font-bold text-center">
                        Terms of Service
                    </h1>
                </div>

                <p className="text-sm text-muted-foreground mb-6 text-center">
                    Effective Date: November 1, 2025
                </p>

                <section className="space-y-6 text-sm text-foreground">

                    <h2 className="text-xl font-semibold mt-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using our service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">2. Use of Service</h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>The service is provided for personal, non-commercial use only.</li>
                        <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
                        <li>You are responsible for all activities that occur under your account.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">3. Content and Conduct</h2>
                    <p>
                        You retain ownership of any content you submit, post, or display on or through the service. However, by submitting content, you grant us a worldwide, non-exclusive license to use, modify, and distribute such content for the operation of the service.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">4. Intellectual Property</h2>
                    <p>
                        The service and its original content, features, and functionality are and will remain the exclusive property of [Your Company Name] and its licensors.
                    </p>

                    <h2 className="text-xl font-semibold mt-4">5. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <div className="mt-8 text-center">
                    {/* The secondary "Back to Settings" link can optionally be kept or removed 
                        since the top BackButton serves the primary navigation purpose. */}
                    <Link href="/help" passHref legacyBehavior>
                        <Button variant="outline">
                            Back to Help & Support
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}