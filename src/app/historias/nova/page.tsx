'use client';

import { motion } from 'framer-motion';
import { StoryForm } from '@/components/stories';

export default function NovaHistoriaPage() {
  return (
    <div className="min-h-screen bg-chaos py-24 md:py-32">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--neon-pink)]/5 to-transparent pointer-events-none" />

      <div className="container-chaos max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 mx-auto mb-6 border-2 border-[var(--neon-pink)] flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-[var(--neon-pink)]/10" />
            <svg
              className="w-12 h-12 text-[var(--neon-pink)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--neon-green)]" />
          </motion.div>

          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--text-primary)] mb-4 glitch">
            <span className="text-neon-pink">NOVA</span>{' '}
            <span className="text-neon-green">MAMACADA</span>
          </h1>

          <p className="font-[var(--font-accent)] text-xl text-[var(--neon-yellow)] text-drunk">
            Eternize o caos. Conte sua historia.
          </p>

          <p className="mt-4 text-[var(--text-muted)] font-[var(--font-body)] max-w-lg mx-auto">
            Cada detalhe importa. Cada mamacada merece ser documentada.
            O tribunal dos Depenados quer ouvir tudo.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-chaos p-6 md:p-10"
        >
          <StoryForm mode="create" />
        </motion.div>
      </div>
    </div>
  );
}
