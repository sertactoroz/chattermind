import ChatList from '@/features/chat/components/ChatList';
import AuthGuard from '@/features/auth/components/AuthGuard';

export default function ChatIndexPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <div className="max-w-md mx-auto">
                    <ChatList />
                </div>
            </div>
        </AuthGuard>
    );
}