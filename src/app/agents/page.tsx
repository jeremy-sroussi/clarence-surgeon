'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgents } from '@/hooks/useAgents';
import { AgentList } from '@/components/agents/AgentList';
import { CreateAgentModal } from '@/components/agents/CreateAgentModal';

export default function AgentsPage() {
    const router = useRouter();
    const { agents, createAgent, archiveAgent, deleteAgent } = useAgents();
    const [showCreate, setShowCreate] = useState(false);

    // Listen for sidebar "Create Agent" button event
    useEffect(() => {
        const handler = () => setShowCreate(true);
        window.addEventListener('open-create-agent', handler);
        return () => window.removeEventListener('open-create-agent', handler);
    }, []);

    const handleCreate = useCallback(
        (name: string, specialty?: string) => {
            const agent = createAgent(name, specialty);
            router.push(`/agents/${agent.id}`);
        },
        [createAgent, router]
    );

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Manage Agents</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Create and manage surgical decision protocol agents.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create
                </button>
            </div>

            <AgentList agents={agents} onArchive={archiveAgent} onDelete={deleteAgent} />

            <CreateAgentModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        </div>
    );
}
