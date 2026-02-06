'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar({ onCreateClick }: { onCreateClick?: () => void }) {
    const pathname = usePathname();
    const isAgentsActive = pathname?.startsWith('/agents');

    return (
        <aside className="w-[240px] h-full flex flex-col border-r border-border bg-bg-secondary/50">
            {/* Logo */}
            <div className="px-5 py-4 border-b border-border">
                <Link href="/agents" className="text-lg font-bold tracking-tight">
                    <span className="text-accent-blue">Clarence</span>
                    <span className="text-text-primary">Surgeon</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4">
                <Link
                    href="/agents"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isAgentsActive
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-panel'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.3 24.3 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                        />
                    </svg>
                    Agents
                </Link>
            </nav>

            {/* Create button */}
            {onCreateClick && (
                <div className="px-3 pb-4">
                    <button
                        onClick={onCreateClick}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Agent
                    </button>
                </div>
            )}
        </aside>
    );
}
