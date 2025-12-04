'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NotFoundToast() {
    const router = useRouter();

    useEffect(() => {
        toast.error("Chat not found.");

        // Redirect to chat list after showing the toast
        const t = setTimeout(() => {
            router.push('/chat');
        }, 1500);

        return () => clearTimeout(t);
    }, []);

    return null; // This component does not render anything visible
}
