'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCounterStore } from '@/stores/counter-store';
import { useMamacoConfirmation } from '@/hooks/useMamacoConfirmation';

export function ChaosCounter() {
  const { brigas, acidentes, pts, isLoading, fetchCounters, incrementCounter } = useCounterStore();
  const [pendingType, setPendingType] = useState<'brigas' | 'acidentes' | 'pts' | null>(null);

  const { confirm, MamacoComponents } = useMamacoConfirmation({
    successMessage: '+1 MAMACO!!!',
  });

  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  const handleIncrement = (type: 'brigas' | 'acidentes' | 'pts') => {
    setPendingType(type);
    confirm(async () => {
      await incrementCounter(type);
      setPendingType(null);
    });
  };

  const counters = [
    {
      type: 'brigas' as const,
      label: 'Brigas',
      value: brigas,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.5 14.5L3 21M14.5 9.5L21 3M12 12L3 3M12 12L21 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: 'neon-orange',
      bgGlow: 'var(--neon-orange-glow)',
    },
    {
      type: 'acidentes' as const,
      label: 'Acidentes',
      value: acidentes,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: 'neon-yellow',
      bgGlow: 'var(--neon-yellow-glow)',
    },
    {
      type: 'pts' as const,
      label: 'PTs',
      value: pts,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 2H7a2 2 0 00-2 2v16l7-3 7 3V4a2 2 0 00-2-2z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7v4M12 15h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: 'neon-pink',
      bgGlow: 'var(--neon-pink-glow)',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-2 border-[var(--neon-pink)] border-t-transparent rounded-full spinner-chaos" />
      </div>
    );
  }

  return (
    <>
      <MamacoComponents />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {counters.map((counter, index) => (
          <motion.div
            key={counter.type}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <motion.button
              onClick={() => handleIncrement(counter.type)}
              className={`
                w-full p-6 border-2 border-[var(--${counter.color})]/50
                bg-[var(--surface-card)] hover:bg-[var(--surface-elevated)]
                transition-all duration-300 cursor-pointer
                hover:border-[var(--${counter.color})]
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: `0 0 20px ${counter.bgGlow}`,
              }}
            >
              {/* Icon */}
              <div className={`text-[var(--${counter.color})] mb-4 flex justify-center`}>
                {counter.icon}
              </div>

              {/* Counter Value */}
              <motion.div
                key={counter.value}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`font-[var(--font-display)] text-5xl md:text-6xl text-[var(--${counter.color})] mb-2`}
                style={{
                  textShadow: `0 0 20px ${counter.bgGlow}`,
                }}
              >
                {counter.value}
              </motion.div>

              {/* Label */}
              <div className="font-[var(--font-display)] text-sm uppercase tracking-widest text-[var(--text-secondary)]">
                {counter.label}
              </div>

              {/* Click hint */}
              <div className="mt-4 text-xs text-[var(--text-muted)] font-[var(--font-body)] opacity-0 group-hover:opacity-100 transition-opacity">
                Clique para adicionar +1
              </div>
            </motion.button>

            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none blur-xl"
              style={{ backgroundColor: `var(--${counter.color})` }}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
