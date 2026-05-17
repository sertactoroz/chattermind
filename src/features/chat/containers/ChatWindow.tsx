'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { listMessages, addMessage } from '../services/chatService';
import { api } from '@/lib/api';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import MessageItem from '../components/MessageItem';
import TypingIndicator from '../components/TypingIndicator';
import type { MessageRow } from '../types/chat.types';
import type { Companion } from '@/features/companions/types/companion.types';
import { toast } from 'sonner';
import { SendButton } from '../components/SendButton';
import { useTranslations } from 'next-intl';
import { useSpeechRecognition } from '@/features/speech/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/features/speech/hooks/useSpeechSynthesis';
import { MicrophoneButton } from '@/features/speech/components/MicrophoneButton';
import { VoiceSettingsDialog } from '@/features/speech/components/VoiceSettingsDialog';
import { speechSynthesisService } from '@/features/speech/services/speechSynthesisService';
import type { VoiceOption } from '@/features/speech/types/speech.types';
import { Volume2, VolumeOff, Settings, Download } from 'lucide-react';

const LANGUAGE_MAP: Record<string, string> = {
    German: 'de-DE',
    Turkish: 'tr-TR',
    English: 'en-US',
};


type ConversationTurn = 'idle' | 'user_speaking' | 'ai_thinking' | 'ai_speaking';

type Props = {
    chatId: string;
    characterId?: string | null;
    companion?: Companion | null;
};

export default function ChatWindow({ chatId, characterId, companion }: Props) {
    const t = useTranslations('ChatWindow');
    const { user } = useAuthContext();
    const [messages, setMessages] = useState<MessageRow[]>([]);
    const [text, setText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [sending, setSending] = useState(false);
    const [aiTyping, setAiTyping] = useState(false);
    const [enableTTS, setEnableTTS] = useState(true);
    const listRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
    const [turn, setTurn] = useState<ConversationTurn>('idle');
    const [allVoices, setAllVoices] = useState<VoiceOption[]>([]);
    const autoSendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingSpeechText = useRef('');

    const speechLang = useMemo(
        () => LANGUAGE_MAP[companion?.language ?? ''] ?? 'en-US',
        [companion?.language]
    );

    const speechRecognition = useSpeechRecognition({
        language: speechLang,
        continuous: false,
        interimResults: true,
    });

    const savedVoiceConfig = useMemo(() => {
        if (typeof window === 'undefined') return {};
        try {
            const saved = localStorage.getItem('chattermind_voice_config');
            if (saved) return JSON.parse(saved);
        } catch {}
        return {};
    }, []);

    const speechSynthesis = useSpeechSynthesis({
        pitch: savedVoiceConfig.pitch ?? 1,
        rate: savedVoiceConfig.rate ?? 1,
        volume: savedVoiceConfig.volume ?? 1,
        lang: speechLang,
        voiceURI: savedVoiceConfig.voiceURI ?? '',
    });

    const speechSynthesisRef = useRef(speechSynthesis);
    speechSynthesisRef.current = speechSynthesis;
    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    useEffect(() => {
        if (speechRecognition.isListening) {
            setTurn('user_speaking');
        } else if (!aiTyping && !speechSynthesis.isSpeaking && !sending) {
            setTurn('idle');
        }
    }, [speechRecognition.isListening, aiTyping, speechSynthesis.isSpeaking, sending]);

    useEffect(() => {
        if (aiTyping) {
            setTurn('ai_thinking');
        } else if (speechSynthesis.isSpeaking) {
            setTurn('ai_speaking');
        } else if (!speechRecognition.isListening && !sending) {
            setTurn('idle');
        }
    }, [aiTyping, speechSynthesis.isSpeaking, speechRecognition.isListening, sending]);

    useEffect(() => {
        if (speechRecognition.interimTranscript && speechRecognition.isListening) {
            setInterimText(speechRecognition.interimTranscript);
        } else if (!speechRecognition.isListening) {
            setInterimText('');
        }
    }, [speechRecognition.interimTranscript, speechRecognition.isListening]);

    useEffect(() => {
        if (speechRecognition.transcript && !speechRecognition.isListening) {
            const finalText = speechRecognition.transcript.trim();
            if (finalText) {
                pendingSpeechText.current = finalText;
            }
            speechRecognition.resetTranscript();
        }
    }, [speechRecognition.transcript, speechRecognition.isListening, speechRecognition.resetTranscript]);

    useEffect(() => {
        const updateVoices = () => {
            setAllVoices(speechSynthesisService.getAvailableVoices());
        };

        updateVoices();

        const synth = window.speechSynthesis;
        if (synth.onvoiceschanged !== undefined) {
            synth.addEventListener('voiceschanged', updateVoices);
        }

        return () => {
            if (synth.onvoiceschanged !== undefined) {
                synth.removeEventListener('voiceschanged', updateVoices);
            }
        };
    }, []);

    useEffect(() => {
        if (!speechRecognition.isListening && pendingSpeechText.current && !sending && !aiTyping) {
            const speechText = pendingSpeechText.current;
            pendingSpeechText.current = '';
            setInterimText('');
            const newText = text.trim() ? text.trim() + ' ' + speechText : speechText;
            setText(newText);
            autoSendTimer.current = setTimeout(() => {
                setText(newText);
            }, 100);
        }
    }, [speechRecognition.isListening, sending, aiTyping]);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        });
    }, []);

    const checkScrollPosition = (): boolean => {
        if (!listRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        return scrollHeight - clientHeight - scrollTop <= 5;
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

        return () => {
            mounted = false;
            speechSynthesisRef.current.stop();
        };
    }, [chatId]);

    const handleSend = useCallback(async () => {
        if (!text.trim() || !user) return;
        const content = text.trim();
        setText('');
        setInterimText('');
        speechRecognition.resetTranscript();
        pendingSpeechText.current = '';
        if (autoSendTimer.current) {
            clearTimeout(autoSendTimer.current);
            autoSendTimer.current = null;
        }
        autoResize();
        setSending(true);
        setTurn('user_speaking');
        scrollToBottom();

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
            try {
                const saved = await addMessage(chatId, 'user', content);
                setMessages(prev => prev.map(m => (m.id === tempId ? saved : m)));
            } catch (dbErr) {
                console.error('DB save user message error', dbErr);
                setMessages(prev => prev.filter(m => m.id !== tempId));
                toast.error(t('toast_sendFailed_title'), { description: t('toast_sendFailed_desc') });
                setSending(false);
                setTurn('idle');
                return;
            }

            setAiTyping(true);
            scrollToBottom();

            const responseData = await api.post<{ ai: string; warning?: string }>('/api/chat/ai', { chatId, userId: user.id, content, characterId });

            let aiMessage: MessageRow | undefined;

            if (responseData.ai) {
                aiMessage = {
                    id: `fallback-ai-${Date.now()}`,
                    chat_id: chatId,
                    sender: 'ai',
                    content: responseData.ai,
                    created_at: new Date().toISOString(),
                } as MessageRow;
            } else if (!aiMessage) {
                toast.warning(t('toast_aiPartial_title'), { description: t('toast_aiPartial_desc') });
                setAiTyping(false);
                setTurn('idle');
                return;
            }

            setMessages(prev => [...prev, aiMessage]);
            setAiTyping(false);
            scrollToBottom();

            if (enableTTS && aiMessage.content) {
                speechSynthesisRef.current.speak(aiMessage.content);
                setSpeakingMessageId(aiMessage.id);
            }
        } catch (err) {
            console.error('send error', err);
            toast.error(t('toast_networkError_title'), { description: t('toast_networkError_desc') });
            setAiTyping(false);
            setTurn('idle');
        } finally {
            setSending(false);
        }
    }, [text, user, chatId, characterId, t, scrollToBottom]);

    useEffect(() => {
        if (!speechRecognition.isListening && text.trim() && !sending && !aiTyping && !speechRecognition.transcript) {
            const timer = setTimeout(() => {
                handleSend();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [speechRecognition.isListening, text, sending, aiTyping, speechRecognition.transcript, handleSend]);

    const handleMicClick = () => {
        if (speechRecognition.isListening) {
            speechRecognition.stopListening();
        } else {
            setText('');
            setInterimText('');
            speechRecognition.resetTranscript();
            pendingSpeechText.current = '';
            speechSynthesis.stop();
            setSpeakingMessageId(null);
            speechRecognition.startListening();
        }
    };

    const handleSpeakMessage = (messageId: string, content: string) => {
        if (speakingMessageId === messageId) {
            speechSynthesis.stop();
            setSpeakingMessageId(null);
        } else {
            speechSynthesis.stop();
            speechSynthesis.speak(content);
            setSpeakingMessageId(messageId);
            setEnableTTS(true);
        }
    };

    const handleToggleTTS = () => {
        if (enableTTS) {
            speechSynthesis.stop();
            setSpeakingMessageId(null);
            setEnableTTS(false);
        } else {
            setEnableTTS(true);
        }
    };

    const handleExport = async (format: 'txt' | 'json') => {
        try {
            const token = api.getToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/chat/${chatId}/export?format=${format}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            if (!response.ok) throw new Error('Export failed');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-${chatId}.${format}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error('Export failed');
        }
    };

    const handleVoiceConfigChange = (newConfig: Partial<{ voiceURI: string; pitch: number; rate: number; volume: number }>) => {
        speechSynthesis.setConfig(newConfig);
        try {
            localStorage.setItem('chattermind_voice_config', JSON.stringify({ ...speechSynthesis.config, ...newConfig }));
        } catch {}
    };

    const TEST_TEXTS: Record<string, string> = {
        'de-DE': 'Hallo! Ich bin Ihr Sprachlehrer. Wie geht es Ihnen heute?',
        'tr-TR': 'Merhaba! Ben dil öğretmeninizim. Bugün nasılsınız?',
        'en-US': 'Hello! I am your language teacher. How are you today?',
    };

    const handlePlayPreview = (voiceURI: string) => {
        speechSynthesis.stop();
        speechSynthesis.setConfig({ voiceURI });
        speechSynthesis.speak(TEST_TEXTS[speechLang] || TEST_TEXTS['en-US']);
    };

    const turnLabels: Record<string, string> = {
        user_speaking: t('turn_user_speaking'),
        ai_thinking: t('turn_ai_thinking'),
        ai_speaking: t('turn_ai_speaking'),
    };

    const showTurnIndicator = turn !== 'idle';

    return (
        <div className="relative flex flex-col h-full pb-4">
            <div
                ref={listRef}
                className="flex-1 overflow-auto p-4 space-y-3 min-h-0"
                onScroll={() => setIsAtBottom(checkScrollPosition())}
            >
                {messages.length === 0 && !aiTyping && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <p className="text-sm">{t('empty_state')}</p>
                        </div>
                    </div>
                )}
                {messages.map(m => (
                    <MessageItem
                        key={m.id}
                        message={m}
                        companion={m.sender === 'ai' ? (companion || { id: 'assistant', name: 'Assistant', promptKey: '', avatar: undefined }) : undefined}
                        onSpeak={m.sender === 'ai' && speechSynthesis.isSupported ? () => handleSpeakMessage(m.id, m.content) : undefined}
                        isSpeaking={speakingMessageId === m.id}
                    />
                ))}
                {aiTyping && <TypingIndicator />}
            </div>

            {showTurnIndicator && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/80 backdrop-blur-sm border border-border/50 shadow-sm">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {turn === 'ai_thinking' && (
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                                </div>
                            )}
                            {turn === 'ai_speaking' && (
                                <Volume2 className="w-3.5 h-3.5 text-primary animate-pulse" />
                            )}
                            <span>{turnLabels[turn]}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 border-t border-border bg-background">
                <div className="relative flex items-end gap-2 rounded-2xl border border-input bg-muted/30 px-3 py-2 transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
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
                            value={text + (interimText ? (text ? ' ' : '') + interimText : '')}
                            onChange={e => {
                                setText(e.target.value);
                                autoResize();
                                if (isAtBottom) scrollToBottom();
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            rows={1}
                            className="w-full resize-none overflow-y-auto bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-32 py-1.5"
                            placeholder={speechRecognition.isListening ? t('voice_listening') : t('placeholder')}
                            disabled={sending || aiTyping}
                        />
                        {speechRecognition.isListening && (
                            <div className="absolute bottom-0 right-0 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                </span>
                                <span className="text-[11px] font-medium text-red-500">{t('voice_recording')}</span>
                            </div>
                        )}
                    </div>

                    <SendButton
                        onSend={handleSend}
                        isEmpty={!text.trim() && !interimText.trim()}
                        aiTyping={aiTyping}
                        loading={sending}
                    />
                </div>

                {speechSynthesis.isSupported && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                        <button
                            type="button"
                            onClick={handleToggleTTS}
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                                enableTTS
                                    ? 'text-primary bg-primary/5 hover:bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {enableTTS ? (
                                <Volume2 className="w-3 h-3" />
                            ) : (
                                <VolumeOff className="w-3 h-3" />
                            )}
                            {enableTTS ? 'Voice On' : 'Voice Off'}
                        </button>

                        <VoiceSettingsDialog
                            voices={allVoices}
                            config={speechSynthesis.config}
                            onConfigChange={handleVoiceConfigChange}
                            onPlayPreview={handlePlayPreview}
                            isSpeaking={speechSynthesis.isSpeaking}
                            lang={speechLang}
                        >
                            <button
                                type="button"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Voice
                            </button>
                        </VoiceSettingsDialog>

                        <button
                            type="button"
                            onClick={() => handleExport('txt')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                )}
            </div>

            {speechRecognition.error && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm shadow-lg">
                    {speechRecognition.error}
                </div>
            )}
        </div>
    );
}
