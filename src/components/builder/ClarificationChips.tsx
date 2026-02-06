'use client';

import { useCallback, useState } from 'react';
import type { ClarificationQuestion } from '@/lib/types';

interface ClarificationChipsProps {
    clarification: ClarificationQuestion;
    questionNumber?: number;
    totalQuestions?: number;
    onAnswer: (answer: string) => void;
}

export function ClarificationChips({ clarification, questionNumber, totalQuestions, onAnswer }: ClarificationChipsProps) {
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherText, setOtherText] = useState('');

    const handleOtherSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!otherText.trim()) return;
            onAnswer(otherText.trim());
            setOtherText('');
            setShowOtherInput(false);
        },
        [otherText, onAnswer]
    );

    if (clarification.answered) {
        return (
            <div className="rounded-xl border border-border bg-bg-panel/30 px-4 py-3">
                <p className="text-xs text-text-secondary/60 line-through">{clarification.question}</p>
                <p className="text-xs text-accent-green mt-1">Answered: {clarification.answer}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 px-4 py-3">
            {questionNumber && totalQuestions && totalQuestions > 1 && (
                <p className="text-[10px] text-accent-amber/60 font-medium uppercase tracking-wide mb-1">
                    Question {questionNumber}/{totalQuestions}
                </p>
            )}
            <p className="text-sm text-text-primary mb-3">{clarification.question}</p>

            <div className="flex flex-wrap gap-2">
                {clarification.suggestions.map((suggestion, i) => (
                    <button
                        key={i}
                        onClick={() => onAnswer(suggestion)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-accent-amber/30 bg-accent-amber/5 text-accent-amber hover:bg-accent-amber/15 hover:border-accent-amber/50 transition-colors cursor-pointer"
                    >
                        {suggestion}
                    </button>
                ))}

                {!showOtherInput ? (
                    <button
                        onClick={() => setShowOtherInput(true)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-text-secondary hover:border-accent-blue/30 hover:text-text-primary transition-colors cursor-pointer"
                    >
                        Other...
                    </button>
                ) : (
                    <form onSubmit={handleOtherSubmit} className="flex items-center gap-2 w-full mt-2">
                        <input
                            type="text"
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            placeholder="Type your answer..."
                            autoFocus
                            className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-bg-primary text-xs text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-blue/50"
                        />
                        <button
                            type="submit"
                            disabled={!otherText.trim()}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Send
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
