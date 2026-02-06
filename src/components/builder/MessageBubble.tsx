'use client';

import { motion } from 'framer-motion';
import type { BuilderMessage } from '@/lib/types';
import { ClarificationChips } from './ClarificationChips';

interface MessageBubbleProps {
    message: BuilderMessage;
    onAnswerClarification?: (clarificationId: string, answer: string) => void;
}

export function MessageBubble({ message, onAnswerClarification }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[80%] ${
                    isUser
                        ? 'bg-accent-blue/10 border border-accent-blue/20 rounded-2xl rounded-br-md px-4 py-3'
                        : 'space-y-3'
                }`}
            >
                {isUser ? (
                    <p className="text-sm text-text-primary">{message.content}</p>
                ) : (
                    <>
                        {/* Onboarding messages render as styled text */}
                        {message.isOnboarding && (
                            <div className="rounded-xl border border-border bg-bg-panel/50 px-4 py-3">
                                <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                                    {message.content.split('**').map((part, i) =>
                                        i % 2 === 1 ? (
                                            <span key={i} className="font-semibold text-accent-blue">
                                                {part}
                                            </span>
                                        ) : (
                                            <span key={i}>{part}</span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Clarification questions (batch — sequential reveal) */}
                        {message.clarifications && message.clarifications.length > 0 && (
                            <div className="space-y-3">
                                {message.clarifications.map((clarification, index) => {
                                    // Only show answered questions + the next unanswered one
                                    const firstUnansweredIndex = message.clarifications!.findIndex((c) => !c.answered);
                                    const isVisible = clarification.answered || index === firstUnansweredIndex;
                                    if (!isVisible) return null;

                                    return (
                                        <ClarificationChips
                                            key={clarification.id}
                                            clarification={clarification}
                                            questionNumber={index + 1}
                                            totalQuestions={message.clarifications!.length}
                                            onAnswer={(answer) =>
                                                onAnswerClarification?.(clarification.id, answer)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {!message.isOnboarding && (
                    <span className={`block text-[10px] mt-1 ${isUser ? 'text-accent-blue/40 text-right' : 'text-text-secondary/30'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
