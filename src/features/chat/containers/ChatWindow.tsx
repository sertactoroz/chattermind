'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { listMessages, addMessage } from '../services/chatService';
import { subscribeMessages } from '../services/realtime';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import MessageItem from '../components/MessageItem';
import TypingIndicator from '../components/TypingIndicator';
import type { MessageRow } from '../types/chat.types';
import type { Character } from '@/features/characters/types/character.types';
import { toast } from 'sonner';
import { SendButton } from '../components/SendButton';
import { useTranslations } from 'next-intl';
import { useSpeechRecognition } from '@/features/speech/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/features/speech/hooks/useSpeechSynthesis';
import { MicrophoneButton } from '@/features/speech/components/MicrophoneButton';
import { VoiceSettingsDialog } from '@/features/speech/components/VoiceSettingsDialog';
import { SpeechToggle } from '@/features/speech/components/SpeechToggle';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LANGUAGE_MAP: Record<string, string> = {
    German: 'de-DE',
    Turkish: 'tr-TR',
    English: 'en-US',
};

type AIMessageResponse = {
    aiMessage: MessageRow;
};

type Props = {
    chatId: string;
    characterId?: string | null;
    character?: Character | null;
};

export default function ChatWindow({ chatId, characterId, character }: Props) {
    const t = useTranslations('ChatWindow');
    const { user } = useAuthContext();
    const [messages, setMessages] = useState<MessageRow[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [aiTyping, setAiTyping] = useState(false);
    const [enableTTS, setEnableTTS] = useState(true);
    const listRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const speechLang = useMemo(
        () => LANGUAGE_MAP[character?.language ?? ''] ?? 'en-US',
        [character?.language]
    );

    const speechRecognition = useSpeechRecognition({
        language: speechLang,
        continuous: false,
        interimResults: true,
    });

    const speechSynthesis = useSpeechSynthesis({
        pitch: 1,
        rate: 1,
        volume: 1,
    });

    useEffect(() => {
        console.log('Character Debug:', {
            character,
            characterId,
            hasAvatar: !!character?.avatar,
            avatarUrl: character?.avatar,
            speechLang,
        });
    }, [character, characterId, speechLang]);

    useEffect(() => {
        if (speechRecognition.transcript && !speechRecognition.isListening) {
            setText(prev => {
                const newText = prev + ' ' + speechRecognition.transcript;
                return newText.trim();
            });
            speechRecognition.resetTranscript();
            textareaRef.current?.focus();
        }
    }, [speechRecognition.transcript, speechRecognition.isListening, speechRecognition.resetTranscript]);

    useEffect(() => {
        if (speechRecognition.interimTranscript) {
            const baseText = text;
            setText(baseText + (baseText ? ' ' : '') + speechRecognition.interimTranscript);
        }
    }, [speechRecognition.interimTranscript]);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        });
    };

    const checkScrollPosition = (): boolean => {
        if (!listRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        const tolerance = 5;
        return scrollHeight - clientHeight - scrollTop <= tolerance;
    };

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        if (el.scrollHeight > el.clientHeight) {
            el.scrollTop = el.scrollHeight;
        }
    };

    useEffect(() => {
        if (!chatId) return;
        let mounted = true;

        (async () => {
            try {
                const rows = await listMessages(chatId);
                if (!mounted) return;
                setMessages(rows);
                scrollToBottom();
            } catch (err) {
                console.error('listMessages error', err);
                toast.error(t('toast_loadHistoryFailed_title'), {
                    description: t('toast_loadHistoryFailed_desc'),
                });
            }
        })();

        const sub = subscribeMessages(chatId, (msg: MessageRow) => {
            if (!msg) return;

            setMessages(prev => {
                if (prev.some(p => p.id === msg.id)) return prev;
                const next = [...prev, msg];
                next.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                return next;
            });

            if (msg.sender === 'ai') {
                setAiTyping(false);
                if (enableTTS && msg.content) {
                    speechSynthesis.speak(msg.content);
                }
            }

            if (checkScrollPosition()) {
                scrollToBottom();
            }
        });

        return () => {
            mounted = false;
            sub.unsubscribe();
            speechSynthesis.cancel();
        };
    }, [chatId, t, enableTTS, speechSynthesis]);

    const handleSend = async () => {
        if (!text.trim() || !user) return;
        const content = text.trim();
        setText('');
        speechRecognition.resetTranscript();
        autoResize();
        scrollToBottom();
        setSending(true);

        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: MessageRow = {
            id: tempId,
            chat_id: chatId,
            sender: 'user',
            content,
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMsg]);
        scrollToBottom();

        try {
            let savedUserMsg: MessageRow;
            try {
                savedUserMsg = await addMessage(chatId, 'user', content);
                setMessages(prev => prev.map(m => (m.id === tempId ? savedUserMsg : m)));
            } catch (dbErr) {
                console.error('DB save user message error', dbErr);
                setMessages(prev => prev.filter(m => m.id !== tempId));
                toast.error(t('toast_sendFailed_title'), { description: t('toast_sendFailed_desc') });
                setSending(false);
                return;
            }

            setAiTyping(true);
            scrollToBottom();

            const resp = await fetch('/api/chat/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, userId: user.id, content, characterId }),
            });

            if (!resp.ok) {
                const txt = await resp.text();
                console.error('AI API error', txt);
                toast.error(t('toast_aiFailed_title'), { description: t('toast_aiFailed_desc') });
                setAiTyping(false);
                return;
            }

            const responseData: AIMessageResponse = await resp.json();
            let aiMessage = responseData.aiMessage;

            if (!aiMessage && (responseData as any).ai) {
                console.warn("Fallback used: API returned raw text. Manually creating message.");
                aiMessage = {
                    id: `fallback-ai-${Date.now()}`,
                    chat_id: chatId,
                    sender: 'ai',
                    content: (responseData as any).ai,
                    created_at: new Date().toISOString(),
                } as MessageRow;
            } else if (!aiMessage) {
                console.error('AI API response missing aiMessage object. Check API logs.');
                toast.warning(t('toast_aiPartial_title'), { description: t('toast_aiPartial_desc') });
                setAiTyping(false);
                return;
            }

            setMessages(prev => [...prev, aiMessage]);
            setAiTyping(false);
            scrollToBottom();

        } catch (err) {
            console.error('send error (Network)', err);
            toast.error(t('toast_networkError_title'), { description: t('toast_networkError_desc') });
            setAiTyping(false);
        } finally {
            setSending(false);
        }
    };

    const handleMicClick = () => {
        if (speechRecognition.isListening) {
            speechRecognition.stopListening();
        } else {
            speechRecognition.startListening();
        }
    };

    const handleTestVoice = (testText: string) => {
        speechSynthesis.speak(testText);
    };

    return (
        <div className="flex flex-col h-full pb-4">
            {speechRecognition.isSupported && (
                <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-background">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">{t('voice_controls')}</span>
                        <div className="h-4 w-px bg-border" />
                        {speechSynthesis.isSupported && (
                            <>
                                <SpeechToggle
                                    isPlaying={speechSynthesis.isSpeaking}
                                    isSupported={speechSynthesis.isSupported}
                                    onToggle={() => setEnableTTS(!enableTTS)}
                                    onCancel={() => speechSynthesis.cancel()}
                                />
                                {speechSynthesis.isSpeaking && (
                                    <button
                                        type="button"
                                        onClick={() => speechSynthesis.cancel()}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        {t('voice_stop')}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    {speechSynthesis.isSupported && (
                        <VoiceSettingsDialog
                            voices={speechSynthesis.voices}
                            config={speechSynthesis.config}
                            onConfigChange={speechSynthesis.setConfig}
                            onTestVoice={handleTestVoice}
                            isSpeaking={speechSynthesis.isSpeaking}
                        >
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </VoiceSettingsDialog>
                    )}
                </div>
            )}

            <div
                ref={listRef}
                className="flex-1 overflow-auto p-4 space-y-3 min-h-0"
                onScroll={() => setIsAtBottom(checkScrollPosition())}
            >
                {messages.map(m => (
                    <MessageItem
                        key={m.id}
                        message={m}
                        character={m.sender === 'ai' ? (character || { name: 'Assistant', avatar: null } as any) : undefined}
                    />
                ))}
                {aiTyping && <TypingIndicator />}
            </div>

            <div className="p-3 border-t border-t-border flex items-center gap-3 bg-background">
                {speechRecognition.isSupported && (
                    <MicrophoneButton
                        isListening={speechRecognition.isListening}
                        isSupported={speechRecognition.isSupported}
                        onClick={handleMicClick}
                        disabled={sending || aiTyping}
                    />
                )}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                            autoResize();
                            if (isAtBottom) {
                                scrollToBottom();
                            }
                        }}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        rows={1}
                        className="flex-1 resize-none overflow-y-auto rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm
                                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-h-52 w-full"
                        placeholder={speechRecognition.isListening ? t('voice_listening') : t('placeholder')}
                        disabled={sending || aiTyping}
                    />
                    {speechRecognition.isListening && (
                        <div className="absolute bottom-1 right-2 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">{t('voice_recording')}</span>
                        </div>
                    )}
                </div>

                <SendButton
                    onSend={handleSend}
                    isEmpty={!text.trim()}
                    aiTyping={aiTyping}
                    loading={sending}
                />
            </div>

            {speechRecognition.error && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm shadow-lg">
                    {speechRecognition.error}
                </div>
            )}
        </div>
    );
}
