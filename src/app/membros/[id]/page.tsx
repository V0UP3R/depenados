'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useMemberStore } from '@/stores/member-store';
import { useMamacoConfirmation } from '@/hooks/useMamacoConfirmation';
import type { Member, Story, Event } from '@/types/story';

interface MemberDetail extends Member {
  storiesAuthored?: Story[];
  storiesIn?: Story[];
  eventsCreated?: Event[];
  eventsIn?: Event[];
  _count?: {
    storiesAuthored: number;
    storiesIn: number;
    eventsCreated: number;
    eventsIn: number;
  };
}

export default function MemberPage() {
  const params = useParams();
  const router = useRouter();
  const { deleteMember } = useMemberStore();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { confirm, MamacoComponents } = useMamacoConfirmation({
    successMessage: 'MEMBRO REMOVIDO!!!',
  });

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

  const handleDelete = () => {
    if (!member) return;

    confirm(async () => {
      setIsDeleting(true);
      const success = await deleteMember(member.id);
      if (success) {
        setTimeout(() => {
          router.push('/membros');
        }, 2800);
      }
      setIsDeleting(false);
    });
  };

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

  const allStories = [...(member.storiesAuthored || []), ...(member.storiesIn || [])];
  const uniqueStories = allStories.filter((story, index, self) => 
    index === self.findIndex((s) => s.id === story.id)
  );

  const allEvents = [...(member.eventsCreated || []), ...(member.eventsIn || [])];
  const uniqueEvents = allEvents.filter((event, index, self) => 
    index === self.findIndex((e) => e.id === event.id)
  );

  return (
    <>
      <MamacoComponents />
      <div className="min-h-screen bg-chaos py-12">
        <div className="container-chaos">
          {/* Back Link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              href="/membros"
              className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-green)] transition-colors mb-8 font-[var(--font-body)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar pra Irmandade
            </Link>
          </motion.div>

          {/* Member Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-8 mb-12"
          >
            {/* Avatar */}
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 border-2 border-[var(--neon-green)] overflow-hidden mx-auto md:mx-0">
              {member.avatar ? (
                <img src={member.avatar} alt={member.nickname} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--surface-dark)] flex items-center justify-center">
                  <span className="font-[var(--font-accent)] text-8xl text-[var(--neon-green)]">
                    {member.nickname.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {member.role && (
                <div className="inline-block px-4 py-2 bg-[var(--neon-yellow)]/10 border border-[var(--neon-yellow)] text-[var(--neon-yellow)] font-[var(--font-display)] text-sm uppercase tracking-wider mb-4">
                  {member.role}
                </div>
              )}
              <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--text-primary)] mb-2">
                {member.nickname}
              </h1>
              <p className="text-xl text-[var(--text-muted)] font-[var(--font-body)] mb-4">
                {member.name}
              </p>
              
              {member.bio && (
                <p className="text-[var(--text-secondary)] font-[var(--font-body)] mb-6 max-w-2xl">
                  {member.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center">
                  <div className="font-[var(--font-accent)] text-3xl text-[var(--neon-pink)]">
                    {member._count?.storiesAuthored || 0}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Historias Contadas</div>
                </div>
                <div className="text-center">
                  <div className="font-[var(--font-accent)] text-3xl text-[var(--neon-blue)]">
                    {member._count?.storiesIn || 0}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Historias Participadas</div>
                </div>
                <div className="text-center">
                  <div className="font-[var(--font-accent)] text-3xl text-[var(--neon-green)]">
                    {member._count?.eventsIn || 0}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Eventos</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stories Section */}
          {uniqueStories.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-[var(--font-display)] text-2xl text-[var(--text-primary)] uppercase tracking-wider">
                  Historias
                </h2>
                <div className="flex-1 divider-chaos h-px" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueStories.slice(0, 6).map((story) => (
                  <Link key={story.id} href={`/historias/${story.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-[var(--surface-card)] border border-[var(--surface-elevated)] p-4 hover:border-[var(--neon-pink)] transition-colors"
                    >
                      <h3 className="font-[var(--font-display)] text-lg text-[var(--text-primary)] mb-2 line-clamp-1">
                        {story.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                        {story.excerpt || story.content.substring(0, 100)}...
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Events Section */}
          {uniqueEvents.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-[var(--font-display)] text-2xl text-[var(--text-primary)] uppercase tracking-wider">
                  Eventos
                </h2>
                <div className="flex-1 divider-chaos h-px" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueEvents.slice(0, 6).map((event) => (
                  <Link key={event.id} href={`/eventos/${event.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-[var(--surface-card)] border border-[var(--surface-elevated)] p-4 hover:border-[var(--neon-blue)] transition-colors"
                    >
                      <h3 className="font-[var(--font-display)] text-lg text-[var(--text-primary)] mb-2 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-8 border-t border-[var(--surface-elevated)]"
          >
            <Link href={`/membros/${member.id}/editar`}>
              <Button variant="ghost" size="lg" className="text-[var(--neon-blue)] hover:border-[var(--neon-blue)]">
                Editar Membro
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="text-[var(--neon-orange)] hover:border-[var(--neon-orange)]"
            >
              Remover da Irmandade
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
