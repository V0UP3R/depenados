'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MemberForm } from '@/components/members';
import type { Member } from '@/types/story';

export default function EditMemberPage() {
  const params = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/members/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setMember(data);
        }
      } catch (error) {
        console.error('Erro ao carregar membro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchMember();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-2 border-[var(--neon-green)] border-t-transparent rounded-full mx-auto mb-4 spinner-chaos" />
          <p className="text-[var(--neon-green)] font-[var(--font-display)] uppercase tracking-wider">
            Carregando membro...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--neon-orange)] mb-4">
            Membro nao encontrado
          </h2>
          <Link href="/membros" className="text-[var(--neon-green)] hover:underline">
            Voltar pra Irmandade
          </Link>
        </div>
      </div>
    );
  }

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
            href={`/membros/${member.id}`}
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-green)] transition-colors mb-6 font-[var(--font-body)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar pro Perfil
          </Link>

          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--text-primary)] mb-2">
            Editar <span className="text-neon-green">Membro</span>
          </h1>
          <p className="text-[var(--text-muted)] font-[var(--font-body)]">
            Atualize os dados do depenado
          </p>
          <div className="divider-chaos w-32 h-1 mt-4" />
        </motion.div>

        {/* Form */}
        <MemberForm initialData={member} mode="edit" />
      </div>
    </div>
  );
}
