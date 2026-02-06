'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognitionResult {
    isListening: boolean;
    interimText: string;
    error: string | null;
    isSupported: boolean;
    start: () => void;
    stop: () => void;
}

// Web Speech API types (not in standard TS lib)
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition: new () => SpeechRecognitionInstance;
    }
}

export function useSpeechRecognition(onFinalResult: (text: string) => void): SpeechRecognitionResult {
    const [isListening, setIsListening] = useState(false);
    const [interimText, setInterimText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const shouldListenRef = useRef(false);
    const onFinalResultRef = useRef(onFinalResult);

    // Keep callback ref up to date
    useEffect(() => {
        onFinalResultRef.current = onFinalResult;
    }, [onFinalResult]);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            setError('Speech recognition is not supported. Please use Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result) {
                    const transcript = result[0];
                    if (transcript) {
                        if (result.isFinal) {
                            onFinalResultRef.current(transcript.transcript);
                            setInterimText('');
                        } else {
                            interim += transcript.transcript;
                        }
                    }
                }
            }
            if (interim) {
                setInterimText(interim);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            // 'no-speech' and 'aborted' are expected during normal use
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                setError(`Speech recognition error: ${event.error}`);
            }
        };

        // Auto-restart on end (handles Chrome ~60s timeout)
        recognition.onend = () => {
            if (shouldListenRef.current) {
                try {
                    recognition.start();
                } catch {
                    // Already started, ignore
                }
            } else {
                setIsListening(false);
                setInterimText('');
            }
        };

        recognitionRef.current = recognition;

        return () => {
            shouldListenRef.current = false;
            recognition.abort();
        };
    }, []);

    const start = useCallback(() => {
        if (!recognitionRef.current) return;
        setError(null);
        shouldListenRef.current = true;
        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch {
            // Already started
        }
    }, []);

    const stop = useCallback(() => {
        if (!recognitionRef.current) return;
        shouldListenRef.current = false;
        recognitionRef.current.stop();
        setIsListening(false);
        setInterimText('');
    }, []);

    return { isListening, interimText, error, isSupported, start, stop };
}
