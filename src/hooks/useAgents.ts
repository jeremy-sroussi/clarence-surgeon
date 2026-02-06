'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Agent } from '@/lib/types';
import { loadAgents, saveAgents, deleteAgent as removeAgent } from '@/lib/storage';

export function useAgents() {
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        setAgents(loadAgents());
    }, []);

    const createAgent = useCallback((name: string, specialty?: string): Agent => {
        const agent: Agent = {
            id: crypto.randomUUID(),
            name,
            specialty,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'active',
            policy: null,
            conversationHistory: [],
            onboardingComplete: false,
        };
        setAgents((prev) => {
            const next = [...prev, agent];
            saveAgents(next);
            return next;
        });
        return agent;
    }, []);

    const archiveAgent = useCallback((id: string) => {
        setAgents((prev) => {
            const next = prev.map((a) => (a.id === id ? { ...a, status: 'archived' as const, updatedAt: Date.now() } : a));
            saveAgents(next);
            return next;
        });
    }, []);

    const deleteAgent = useCallback((id: string) => {
        removeAgent(id);
        setAgents((prev) => prev.filter((a) => a.id !== id));
    }, []);

    return { agents, createAgent, archiveAgent, deleteAgent };
}
