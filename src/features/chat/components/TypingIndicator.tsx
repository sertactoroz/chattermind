'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
    // The typing indicator simulates the AI's incoming message.
    // It should use the same theme-aware classes as the AI message in MessageItem.tsx:
    // bg-muted for the background (e.g., light gray in light mode, dark gray in dark mode).
    // text-foreground for the text color.
    return (
        <div className="mr-auto bg-muted text-foreground px-3 py-2 rounded-xl inline-block">
            {/* The motion.div adds the pulsing effect to simulate typing */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                className="text-sm"
            >
                Typing...
            </motion.div>
        </div>
    );
}