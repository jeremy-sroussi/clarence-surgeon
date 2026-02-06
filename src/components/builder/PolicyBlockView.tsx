'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { PolicyBlock } from '@/lib/types';

interface PolicyBlockViewProps {
    title: string;
    icon: React.ReactNode;
    block: PolicyBlock;
    accentClass: string;
    newItemIds?: Set<string>;
}

export function PolicyBlockView({ title, icon, block, accentClass, newItemIds }: PolicyBlockViewProps) {
    return (
        <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
                <span className={accentClass}>{icon}</span>
                <h3 className={`text-xs font-semibold uppercase tracking-wide ${accentClass}`}>{title}</h3>
                <span className="text-[10px] text-text-secondary/40 ml-auto">{block.items.length}</span>
            </div>
            {block.items.length === 0 ? (
                <p className="text-xs text-text-secondary/30 italic pl-5">No items yet</p>
            ) : (
                <ul className="space-y-1.5 pl-5">
                    <AnimatePresence initial={false}>
                        {block.items.map((item) => {
                            const isNew = newItemIds?.has(item.id);
                            return (
                                <motion.li
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -8, height: 0 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        height: 'auto',
                                        backgroundColor: isNew
                                            ? ['rgba(139,92,246,0.15)', 'rgba(139,92,246,0)']
                                            : 'rgba(0,0,0,0)',
                                    }}
                                    exit={{ opacity: 0, x: -8, height: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        backgroundColor: isNew
                                            ? { duration: 2, ease: 'easeOut' }
                                            : { duration: 0 },
                                    }}
                                    className="text-xs text-text-secondary leading-relaxed rounded px-1.5 -mx-1.5"
                                >
                                    <span className="text-text-primary">{item.description}</span>
                                </motion.li>
                            );
                        })}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
}
