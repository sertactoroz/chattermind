// src/app/chat/page.tsx
import AuthGuard from "@/features/common/components/AuthGuard";
import ChatList from "@/features/chat/components/ChatList";

export default function ChatPage() {
    return (
        <AuthGuard>
            <ChatList />
        </AuthGuard>
    );
}
