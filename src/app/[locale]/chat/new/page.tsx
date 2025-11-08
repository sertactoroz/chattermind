'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { createChat } from '@/features/chat/services/chatService';

export default function ChatNewPage() {
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (!user) {
                router.push('/');
                return;
            }
            try {
                const chat = await createChat(user.id, null, 'New chat');
                router.replace(`/chat/${chat.id}`);
            } catch (err) {
                console.error('failed to create chat', err);
                router.push('/chat');
            }
        })();
    }, [user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <p className="mb-2">Creating chat…</p>
                <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse mx-auto" />
            </div>
        </div>
    );
}







