import ChatList from '@/features/chat/components/ChatList';
import AuthGuard from '@/features/common/components/AuthGuard';

export default function ChatIndexPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-md mx-auto">
                    <ChatList />
                </div>
            </div>
        </AuthGuard>
    );
}
