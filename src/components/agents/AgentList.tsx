'use client';

import { useMemo, useState } from 'react';
import type { Agent } from '@/lib/types';
import { AgentCard } from './AgentCard';

type Tab = 'all' | 'active' | 'archived';

interface AgentListProps {
    agents: Agent[];
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AgentList({ agents, onArchive, onDelete }: AgentListProps) {
    const [tab, setTab] = useState<Tab>('all');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        let list = agents;
        if (tab === 'active') list = list.filter((a) => a.status === 'active');
        if (tab === 'archived') list = list.filter((a) => a.status === 'archived');
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (a) => a.name.toLowerCase().includes(q) || a.specialty?.toLowerCase().includes(q)
            );
        }
        return list.sort((a, b) => b.updatedAt - a.updatedAt);
    }, [agents, tab, search]);

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: agents.length },
        { key: 'active', label: 'Active', count: agents.filter((a) => a.status === 'active').length },
        { key: 'archived', label: 'Archived', count: agents.filter((a) => a.status === 'archived').length },
    ];

    return (
        <div>
            {/* Search + Tabs */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search (Name, Specialty)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-bg-secondary/50 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-blue/50"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-border mb-6">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                            tab === t.key
                                ? 'border-accent-blue text-accent-blue'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        {t.label}
                        <span className="ml-1.5 text-xs opacity-60">{t.count}</span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-text-secondary text-sm">
                        {search ? 'No agents match your search.' : 'No agents yet. Create your first one.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} onArchive={onArchive} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
