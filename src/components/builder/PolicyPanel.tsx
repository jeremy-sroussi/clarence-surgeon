'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConsultationPolicy, PolicyRule } from '@/lib/types';
import { PolicyBlockView } from './PolicyBlockView';

const RULE_TYPE_CONFIG: Record<PolicyRule['type'], { label: string; accentClass: string }> = {
    gate: { label: 'Gates (Scope)', accentClass: 'text-accent-red' },
    prerequisite: { label: 'Prerequisites (Readiness)', accentClass: 'text-accent-amber' },
    accelerator: { label: 'Accelerators (Urgency)', accentClass: 'text-medical' },
    action: { label: 'Actions', accentClass: 'text-accent-green' },
};

function collectAllItemIds(policy: ConsultationPolicy): Set<string> {
    const ids = new Set<string>();
    for (const block of Object.values(policy.blocks)) {
        for (const item of block.items) {
            ids.add(item.id);
        }
    }
    for (const rule of policy.rules) {
        ids.add(rule.id);
    }
    return ids;
}

interface PolicyPanelProps {
    open: boolean;
    onClose: () => void;
    policy: ConsultationPolicy | null;
}

export function PolicyPanel({ open, onClose, policy }: PolicyPanelProps) {
    const prevItemIdsRef = useRef<Set<string>>(new Set());

    // Compute which item IDs are new (not in the previous policy)
    const newItemIds = useMemo(() => {
        if (!policy) return new Set<string>();
        const currentIds = collectAllItemIds(policy);
        const newIds = new Set<string>();
        for (const id of currentIds) {
            if (!prevItemIdsRef.current.has(id)) {
                newIds.add(id);
            }
        }
        return newIds;
    }, [policy]);

    // Update the ref after rendering so next change can diff against it
    useEffect(() => {
        if (policy) {
            prevItemIdsRef.current = collectAllItemIds(policy);
        }
    }, [policy]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 420, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="h-full border-l border-border bg-bg-primary flex flex-col overflow-hidden flex-shrink-0"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
                        <h2 className="text-sm font-semibold text-text-primary whitespace-nowrap">
                            Consultation Policy{policy ? ` (v${policy.version})` : ''}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-panel transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                        {policy ? (
                            <div>
                                <PolicyBlockView
                                    title="High Potential Patients"
                                    icon={
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                    block={policy.blocks.highPotentialPatients}
                                    accentClass="text-accent-green"
                                    newItemIds={newItemIds}
                                />

                                <PolicyBlockView
                                    title="Low Potential Patients"
                                    icon={
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                    }
                                    block={policy.blocks.lowPotentialPatients}
                                    accentClass="text-accent-red"
                                    newItemIds={newItemIds}
                                />

                                <PolicyBlockView
                                    title="In-Between"
                                    icon={
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                    }
                                    block={policy.blocks.inBetween}
                                    accentClass="text-accent-amber"
                                    newItemIds={newItemIds}
                                />

                                <PolicyBlockView
                                    title="Actions For Non-Qualified"
                                    icon={
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                        </svg>
                                    }
                                    block={policy.blocks.forNonQualified}
                                    accentClass="text-accent-blue"
                                    newItemIds={newItemIds}
                                />

                                {policy.rules.length > 0 && (
                                    <>
                                        <div className="border-t border-border my-5" />
                                        <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wide mb-4">
                                            Actionable Rules
                                        </h2>

                                        {(['gate', 'prerequisite', 'accelerator', 'action'] as const).map((ruleType) => {
                                            const rules = policy.rules.filter((r) => r.type === ruleType);
                                            if (rules.length === 0) return null;
                                            const config = RULE_TYPE_CONFIG[ruleType];
                                            return (
                                                <div key={ruleType} className="mb-4">
                                                    <h3 className={`text-[10px] font-semibold uppercase tracking-wide mb-2 ${config.accentClass}`}>
                                                        {config.label}
                                                    </h3>
                                                    <ul className="space-y-1.5">
                                                        {rules.map((rule) => {
                                                            const isNew = newItemIds.has(rule.id);
                                                            return (
                                                                <motion.li
                                                                    key={rule.id}
                                                                    layout
                                                                    initial={{ opacity: 0, x: -8 }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        x: 0,
                                                                        backgroundColor: isNew
                                                                            ? ['rgba(139,92,246,0.15)', 'rgba(139,92,246,0)']
                                                                            : 'rgba(0,0,0,0)',
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.25,
                                                                        backgroundColor: isNew
                                                                            ? { duration: 2, ease: 'easeOut' }
                                                                            : { duration: 0 },
                                                                    }}
                                                                    className="text-xs text-text-secondary rounded px-1.5 -mx-1.5"
                                                                >
                                                                    <span className="text-text-primary font-medium">If</span> {rule.condition}{' '}
                                                                    <span className="text-text-primary font-medium">then</span> {rule.outcome}
                                                                </motion.li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-text-secondary/40">No policy yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
