'use client';

import { useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useBuilder } from '@/hooks/useBuilder';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { BuilderConversation } from '@/components/builder/BuilderConversation';
import { DictationZone } from '@/components/builder/DictationZone';
import { PolicyPanel } from '@/components/builder/PolicyPanel';

export default function BuilderPage() {
    const { id } = useParams<{ id: string }>();
    const { state, dispatch, sendMessage, answerClarification, agentName, agentSpecialty } = useBuilder(id);

    const speechBufferRef = useRef<string[]>([]);

    const onFinalResult = useCallback((text: string) => {
        speechBufferRef.current.push(text);
    }, []);

    const { isListening, interimText, isSupported, start, stop } = useSpeechRecognition(onFinalResult);

    const handleStartRecording = useCallback(() => {
        speechBufferRef.current = [];
        dispatch({ type: 'START_RECORDING' });
        start();
    }, [dispatch, start]);

    const handleStopRecording = useCallback(() => {
        stop();
        dispatch({ type: 'STOP_RECORDING' });
        const fullText = speechBufferRef.current.join(' ');
        speechBufferRef.current = [];
        if (fullText.trim()) {
            sendMessage(fullText);
        }
    }, [stop, dispatch, sendMessage]);

    const handleSendText = useCallback(
        (text: string) => {
            sendMessage(text);
        },
        [sendMessage]
    );

    if (!isSupported) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                    <h1 className="text-xl font-bold text-accent-red mb-2">Browser Not Supported</h1>
                    <p className="text-text-secondary text-sm">
                        Speech recognition requires Chrome. Please open this page in Google Chrome.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-row">
            {/* Left side: Chat area */}
            <div className="flex-1 flex flex-col min-w-0">
                <BuilderHeader
                    agentName={agentName}
                    agentSpecialty={agentSpecialty}
                    status={state.status}
                    policyVersion={state.policy?.version ?? 0}
                    hasPolicy={state.policy !== null}
                    onTogglePolicy={() => dispatch({ type: 'TOGGLE_POLICY_DRAWER' })}
                />

                <BuilderConversation
                    messages={state.messages}
                    isProcessing={state.status === 'processing'}
                    streamingThought={state.streamingThought}
                    onAnswerClarification={answerClarification}
                />

                <DictationZone
                    isRecording={isListening}
                    isProcessing={state.status === 'processing'}
                    interimText={interimText}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    onSendText={handleSendText}
                />
            </div>

            {/* Right side: Policy panel (inline) */}
            <PolicyPanel
                open={state.showPolicyDrawer}
                onClose={() => dispatch({ type: 'TOGGLE_POLICY_DRAWER' })}
                policy={state.policy}
            />
        </div>
    );
}
