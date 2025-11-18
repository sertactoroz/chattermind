'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
    return (
        <div className="mr-auto bg-slate-100 text-slate-800 px-3 py-2 rounded-xl inline-block">
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
