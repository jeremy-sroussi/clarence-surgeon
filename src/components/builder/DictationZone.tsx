'use client';

import { useCallback, useState } from 'react';

interface DictationZoneProps {
    isRecording: boolean;
    isProcessing: boolean;
    interimText: string;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onSendText: (text: string) => void;
}

export function DictationZone({
    isRecording,
    isProcessing,
    interimText,
    onStartRecording,
    onStopRecording,
    onSendText,
}: DictationZoneProps) {
    const [textInput, setTextInput] = useState('');

    const handleSubmitText = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!textInput.trim() || isProcessing) return;
            onSendText(textInput.trim());
            setTextInput('');
        },
        [textInput, isProcessing, onSendText]
    );

    const handleMicClick = useCallback(() => {
        if (isRecording) {
            onStopRecording();
        } else {
            onStartRecording();
        }
    }, [isRecording, onStartRecording, onStopRecording]);

    return (
        <div className="border-t border-border bg-bg-secondary/50 px-6 py-4">
            {/* Interim text */}
            {interimText && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-bg-panel/50 text-sm text-text-secondary italic">
                    {interimText}
                    <span className="inline-block w-0.5 h-4 bg-accent-blue/60 ml-0.5 align-text-bottom animate-pulse" />
                </div>
            )}

            <div className="flex items-center gap-3">
                {/* Mic button */}
                <button
                    onClick={handleMicClick}
                    disabled={isProcessing}
                    className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isRecording
                            ? 'bg-accent-red/10 border-2 border-accent-red text-accent-red'
                            : 'bg-accent-blue/10 border-2 border-accent-blue/30 text-accent-blue hover:border-accent-blue/50'
                    }`}
                >
                    {isRecording && (
                        <span className="absolute inset-0 rounded-full bg-accent-red/20 pulse-ring" />
                    )}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {isRecording ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                        )}
                    </svg>
                </button>

                {/* Text input */}
                <form onSubmit={handleSubmitText} className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={isRecording ? 'Recording...' : 'Or type your clinical logic here...'}
                        disabled={isRecording || isProcessing}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-blue/50 disabled:opacity-40"
                    />
                    <button
                        type="submit"
                        disabled={!textInput.trim() || isRecording || isProcessing}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Send
                    </button>
                </form>
            </div>

            {isRecording && (
                <p className="mt-2 text-xs text-accent-red text-center">
                    Recording... Click the mic button to stop and send.
                </p>
            )}
        </div>
    );
}
