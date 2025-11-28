'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

// Animation properties for a Simple Cross-Fade effect
const variants = {
    // START: Invisible
    initial: { opacity: 0 },

    // END: Fully visible
    animate: { opacity: 1 },

    // EXIT: Fades out
    exit: { opacity: 0 },
};

type Props = {
    children: React.ReactNode;
};

export default function PageTransition({ children }: Props) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={variants}
                initial={false}
                animate="animate"
                exit="exit"
                transition={{
                    type: 'tween',
                    duration: 0.7
                }}
                // Absolute positioning is still necessary to prevent content jump/overlap
                className="w-full h-full absolute top-0 left-0"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}