'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { Companion } from '@/features/companions/types/companion.types';
import type { ChatRow } from '../types/chat.types';

type Props = {
    chat: ChatRow;
    companion?: Companion;
    onDelete?: (chatId: string) => void;
};

function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function ChatItem({ chat, companion, onDelete }: Props) {
    const avatarUrl = companion?.avatar;
    const fallbackText =
        companion?.name?.slice(0, 2).toUpperCase() || (chat.character_id ? chat.character_id.slice(0, 2).toUpperCase() : 'AI');

    const x = useMotionValue(0);
    const controls = useAnimation();
    const [showDelete, setShowDelete] = useState(false);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -80) {
            controls.start({ x: -80, transition: { type: 'spring', stiffness: 300, damping: 30 } });
            setShowDelete(true);
        } else {
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } });
            setShowDelete(false);
        }
    };

    const handleDelete = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
        onDelete?.(chat.id);
    };

    return (
        <li className="relative">
            {showDelete && onDelete && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleDelete}
                    className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-destructive text-destructive-foreground rounded-r-lg z-10"
                >
                    <Trash2 className="w-5 h-5" />
                </motion.button>
            )}
            <motion.div
                style={{ x }}
                animate={controls}
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                className="relative z-20"
            >
                <Link href={`/chat/${chat.id}`} passHref>
                    <Card className="hover:bg-accent/50 transition-all cursor-pointer py-0 border-border/50 hover:border-primary/20 hover:shadow-sm">
                        <div className="p-3 flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-border">
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt={companion?.name || 'Chat'}
                                        fill
                                        sizes="48px"
                                        className="object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                        {fallbackText}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm text-foreground truncate">
                                        {companion?.name || 'New Chat'}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground shrink-0">
                                        {formatTime(chat.created_at)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                    {companion?.role || 'AI Assistant'}
                                </p>
                                <p className="text-sm text-foreground/70 line-clamp-1 mt-1">
                                    {chat.last_message || 'No messages yet'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </motion.div>
        </li>
    );
}
