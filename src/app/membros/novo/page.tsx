'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MemberForm } from '@/components/members';

export default function NewMemberPage() {
  return (
    <div className="min-h-screen bg-chaos py-12">
      <div className="container-chaos max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/membros"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-green)] transition-colors mb-6 font-[var(--font-body)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar pra Irmandade
          </Link>

          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--text-primary)] mb-2">
            Novo <span className="text-neon-green">Membro</span>
          </h1>
          <p className="text-[var(--text-muted)] font-[var(--font-body)]">
            Adicione mais um depenado a irmandade
          </p>
          <div className="divider-chaos w-32 h-1 mt-4" />
        </motion.div>

        {/* Form */}
        <MemberForm mode="create" />
      </div>
    </div>
  );
}
