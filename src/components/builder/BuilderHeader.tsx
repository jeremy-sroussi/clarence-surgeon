'use client';

import Link from 'next/link';
import type { BuilderStatus } from '@/lib/types';

interface BuilderHeaderProps {
    agentName: string;
    agentSpecialty?: string;
    status: BuilderStatus;
    policyVersion: number;
    hasPolicy: boolean;
    onTogglePolicy: () => void;
}

export function BuilderHeader({ agentName, agentSpecialty, status, policyVersion, hasPolicy, onTogglePolicy }: BuilderHeaderProps) {
    return (
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-bg-secondary/50">
            <div className="flex items-center gap-3">
                <Link
                    href="/agents"
                    className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-panel transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>

                <div className="h-5 w-px bg-border" />

                <div>
                    <h1 className="text-sm font-semibold text-text-primary">{agentName}</h1>
                    {agentSpecialty && (
                        <span className="text-[10px] text-accent-blue/70">{agentSpecialty}</span>
                    )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5 ml-2">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            status === 'recording'
                                ? 'bg-accent-red animate-pulse'
                                : status === 'processing'
                                  ? 'bg-accent-purple animate-pulse'
                                  : 'bg-text-secondary/30'
                        }`}
                    />
                    <span className="text-[10px] text-text-secondary">
                        {status === 'recording' ? 'Recording' : status === 'processing' ? 'Analyzing' : 'Ready'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {policyVersion > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20">
                        Policy v{policyVersion}
                    </span>
                )}

                <button
                    onClick={onTogglePolicy}
                    disabled={!hasPolicy}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        hasPolicy
                            ? 'bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20'
                            : 'border border-border text-text-secondary/40 cursor-not-allowed'
                    }`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                    View Policy
                </button>
            </div>
        </header>
    );
}
