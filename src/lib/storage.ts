import type { Agent } from './types';

const STORAGE_KEY = 'surgeon-logic-agents';

export function loadAgents(): Agent[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Agent[]) : [];
    } catch {
        return [];
    }
}

export function saveAgents(agents: Agent[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

export function loadAgent(id: string): Agent | null {
    const agents = loadAgents();
    return agents.find((a) => a.id === id) ?? null;
}

export function saveAgent(agent: Agent): void {
    const agents = loadAgents();
    const idx = agents.findIndex((a) => a.id === agent.id);
    if (idx >= 0) {
        agents[idx] = agent;
    } else {
        agents.push(agent);
    }
    saveAgents(agents);
}

export function deleteAgent(id: string): void {
    const agents = loadAgents().filter((a) => a.id !== id);
    saveAgents(agents);
}
