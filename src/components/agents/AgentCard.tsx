'use client';

import Link from 'next/link';
import type { Agent } from '@/lib/types';

interface AgentCardProps {
    agent: Agent;
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AgentCard({ agent }: AgentCardProps) {
    const hasPolicy = agent.policy !== null;
    const rulesCount = agent.policy?.rules.length ?? 0;

    return (
        <Link
            href={`/agents/${agent.id}`}
            className="group block rounded-xl border border-border bg-bg-panel/50 p-5 transition-all hover:border-accent-blue/40 hover:bg-bg-panel"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${
                            agent.status === 'archived'
                                ? 'bg-text-secondary/30'
                                : hasPolicy
                                  ? 'bg-accent-green'
                                  : 'bg-accent-amber'
                        }`}
                    />
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                        {agent.name}
                    </h3>
                </div>
                {agent.status === 'archived' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-text-secondary/10 text-text-secondary">
                        Archived
                    </span>
                )}
            </div>

            {agent.specialty && (
                <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue/80 mb-3">
                    {agent.specialty}
                </span>
            )}

            <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span>{hasPolicy ? `${rulesCount} rules` : 'No policy yet'}</span>
                {hasPolicy && <span>v{agent.policy!.version}</span>}
                <span className="ml-auto">
                    {new Date(agent.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </Link>
    );
}
