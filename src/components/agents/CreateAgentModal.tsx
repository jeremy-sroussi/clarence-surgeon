'use client';

import { useCallback, useState } from 'react';
import { Modal } from '@/components/ui/Modal';

const SPECIALTY_PRESETS = ['Spine Surgery', 'Orthopedics', 'Neurosurgery', 'General Surgery', 'Cardiac', 'Urology', 'ENT'];

interface CreateAgentModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string, specialty?: string) => void;
}

export function CreateAgentModal({ open, onClose, onCreate }: CreateAgentModalProps) {
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!name.trim()) return;
            onCreate(name.trim(), specialty.trim() || undefined);
            setName('');
            setSpecialty('');
            onClose();
        },
        [name, specialty, onCreate, onClose]
    );

    return (
        <Modal open={open} onClose={onClose}>
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-bg-panel p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-1">Create New Agent</h2>
                <p className="text-xs text-text-secondary mb-6">
                    Define an agent to formalize a surgical decision protocol.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                            Agent Name <span className="text-accent-red">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Shoulder Injury Triage"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-bg-secondary/50 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-blue/50"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                            Specialty <span className="text-text-secondary/40">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            placeholder="e.g. Orthopedics"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-bg-secondary/50 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-blue/50 mb-2"
                        />
                        <div className="flex flex-wrap gap-1.5">
                            {SPECIALTY_PRESETS.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSpecialty(s)}
                                    className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                        specialty === s
                                            ? 'border-accent-blue/50 bg-accent-blue/10 text-accent-blue'
                                            : 'border-border text-text-secondary hover:border-accent-blue/30 hover:text-text-primary'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-blue/10 border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Create Agent
                    </button>
                </div>
            </form>
        </Modal>
    );
}
