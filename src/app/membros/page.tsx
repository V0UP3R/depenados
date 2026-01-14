'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { MemberCard } from '@/components/members';
import { useMemberStore } from '@/stores/member-store';

export default function MembrosPage() {
  const { members, isLoading, fetchMembers } = useMemberStore();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <div className="min-h-screen bg-chaos py-12">
      <div className="container-chaos">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--text-primary)] mb-2">
              A <span className="text-neon-green">Irmandade</span>
            </h1>
            <p className="text-[var(--text-muted)] font-[var(--font-body)] max-w-lg">
              Os mamacos por tras das lendas. Cada um com sua historia, cada um mais depenado que o outro.
            </p>
            <div className="divider-chaos w-32 h-1 mt-4" />
          </div>

          <Link href="/membros/novo">
            <Button variant="neon" size="lg" glitch>
              + Novo Membro
            </Button>
          </Link>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-2 border-[var(--neon-green)] border-t-transparent rounded-full spinner-chaos" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && members.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 border-2 border-[var(--neon-green)] flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--neon-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="font-[var(--font-display)] text-2xl text-[var(--text-primary)] mb-2">
              Nenhum membro ainda
            </h2>
            <p className="text-[var(--text-muted)] font-[var(--font-body)] mb-6">
              A irmandade ainda esta vazia. Seja o primeiro a entrar!
            </p>
            <Link href="/membros/novo">
              <Button variant="neon">Adicionar Primeiro Membro</Button>
            </Link>
          </motion.div>
        )}

        {/* Members Grid */}
        {!isLoading && members.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {members.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
