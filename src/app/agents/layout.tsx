'use client';

import { useCallback } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
    const handleCreateClick = useCallback(() => {
        // Dispatch a custom event that the agents page can listen to
        window.dispatchEvent(new CustomEvent('open-create-agent'));
    }, []);

    return (
        <div className="h-screen flex overflow-hidden bg-bg-primary">
            <Sidebar onCreateClick={handleCreateClick} />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
