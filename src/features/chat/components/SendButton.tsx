import React from "react";

export interface SendButtonProps {
    onSend(): Promise<void>
    loading: boolean
    aiTyping: boolean
    isEmpty: boolean
}

export function SendButton({ onSend, loading, aiTyping, isEmpty }: SendButtonProps) {
    return (
        <button type="button"
            onClick={onSend}
            disabled={loading || aiTyping || isEmpty} // Disable button while AI is typing
            // Button styles: bg-primary and text-primary-foreground (central theme color)
            className="px-3 py-2 rounded bg-primary text-primary-foreground min-h-[44px] hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
            {loading ? 'Sending…' : 'Send'}
        </button>)

}