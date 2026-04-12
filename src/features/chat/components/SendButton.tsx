import React from "react";
import { Send, Loader2 } from "lucide-react";

export interface SendButtonProps {
    onSend(): Promise<void>
    loading: boolean
    aiTyping: boolean
    isEmpty: boolean
}

export function SendButton({ onSend, loading, aiTyping, isEmpty }: SendButtonProps) {
    const disabled = loading || aiTyping || isEmpty;

    return (
        <button
            type="button"
            onClick={onSend}
            disabled={disabled}
            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                disabled
                    ? 'text-muted-foreground/40 cursor-not-allowed'
                    : 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95'
            }`}
            title="Send message"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Send className="w-4 h-4" />
            )}
        </button>
    );
}
