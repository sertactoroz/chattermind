import ChatWindow from '@/features/chat/containers/ChatWindow';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { getDatabaseService } from '@/services/database/DatabaseService';
import companions from '@/features/companions/data/companions.json';
import type { Companion } from '@/features/companions/types/companion.types';

type Props = {
  params: Promise<{ chatId: string }>;
};

export default async function ChatIdPage({ params }: Props) {
  const { chatId } = await params;

  try {
    const db = getDatabaseService();
    const data = await db.getChatById(chatId);

    if (!data) {
      return (
        <div className="flex items-center justify-center flex-1">
          <NotFoundToast />
        </div>
      );
    }

    const companionId = data.companion_id ?? null;

    let companion: Companion | null = null;
    if (companionId) {
      companion = (companions as Companion[]).find((c) => c.id === companionId) ?? null;
    }

    return (
      <ChatWindow chatId={chatId} characterId={companionId} companion={companion} />
    );
  } catch (err) {
    console.error('Chat page error:', err);
    return (
      <div className="flex items-center justify-center flex-1">
        <NotFoundToast />
      </div>
    );
  }
}
