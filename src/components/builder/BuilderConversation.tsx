'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BuilderMessage } from '@/lib/types';
import { MessageBubble } from './MessageBubble';

interface BuilderConversationProps {
    messages: BuilderMessage[];
    isProcessing: boolean;
    streamingThought: string;
    onAnswerClarification: (messageId: string, clarificationId: string, answer: string) => void;
}

export function BuilderConversation({ messages, isProcessing, streamingThought, onAnswerClarification }: BuilderConversationProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isProcessing, streamingThought]);

    return (
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    message={msg}
                    onAnswerClarification={(clarificationId, answer) =>
                        onAnswerClarification(msg.id, clarificationId, answer)
                    }
                />
            ))}

            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-start"
                    >
                        <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-border bg-bg-panel/30 max-w-[80%]">
                            <div className="flex gap-1 mt-1 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-xs text-text-secondary italic whitespace-pre-wrap">
                                {streamingThought || 'Thinking...'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={bottomRef} />
        </div>
    );
}
