'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/features/common/components/BackButton';

export default function PrivacyPolicyPage() {

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="relative flex items-center justify-center pt-4 pb-4">
                <BackButton href="/help" />
                <h1 className="text-3xl font-bold text-center">
                    Privacy Policy
                </h1>
            </div>
            <p className="text-sm text-muted-foreground mb-6 text-center">
                Last updated: November 28, 2025
            </p>
            <section className="space-y-6 text-sm text-foreground">

                <h2 className="text-xl font-semibold mt-4">1. Introduction</h2>
                <p>
                    Welcome to [Your App Name]! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI chat services.
                </p>

                <h2 className="text-xl font-semibold mt-4">2. Data We Collect</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>**Personal Data:** Your name and email address (via sign-up).</li>
                    <li>**Chat Data:** The text of your conversations with the AI characters. This data is used solely to improve our AI models and service performance.</li>
                    <li>**Usage Data:** Information about how you access and use the service (e.g., login times, pages visited).</li>
                </ul>

                <h2 className="text-xl font-semibold mt-4">3. How We Use Your Data</h2>
                <p>
                    We use the information we collect to provide, maintain, and improve our services, develop new features, and communicate with you about service updates and security notices.
                </p>

                <h2 className="text-xl font-semibold mt-4">4. Sharing Your Information</h2>
                <p>
                    We do not share or sell your chat data to third-party advertisers. We may share information with trusted third-party service providers (e.g., hosting, analytics) necessary to operate the service.
                </p>

                <h2 className="text-xl font-semibold mt-4">5. Your Choices</h2>
                <p>
                    You can review and change your personal information by logging into your account settings. You can also request the deletion of your account and all associated data by contacting us.
                </p>
            </section>
            <div className="mt-8 text-center">
                {/* The secondary "Back to Help & Support" link remains */}
                <Link href="/help" passHref legacyBehavior>
                    <Button variant="outline">
                        Back to Help & Support
                    </Button>
                </Link>
            </div>
        </div>
    );
}