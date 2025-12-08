import ChatList from '@/features/chat/components/ChatList';
import AuthGuard from '@/features/auth/components/AuthGuard';

export default function ChatIndexPage() {
    return (
        <AuthGuard>
            <ChatList />
        </AuthGuard>
    );
}