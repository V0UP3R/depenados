'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, ParticipantsList } from '@/components/ui';
import { StoryCard } from '@/components/stories';
import { useEventStore } from '@/stores/event-store';
import { useMamacoConfirmation } from '@/hooks/useMamacoConfirmation';
import type { Event } from '@/types/story';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const { deleteEvent } = useEventStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { confirm, MamacoComponents } = useMamacoConfirmation({
    successMessage: 'EVENTO DELETADO!!!',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        }
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const handleDelete = () => {
    if (!event) return;

    confirm(async () => {
      setIsDeleting(true);
      const success = await deleteEvent(event.id);
      if (success) {
        // Wait for monkey animation before redirect
        setTimeout(() => {
          router.push('/eventos');
        }, 2800);
      }
      setIsDeleting(false);
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      full: date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const statusLabels = {
    upcoming: { text: 'Em breve', color: 'neon-blue' },
    ongoing: { text: 'Rolando agora', color: 'neon-green' },
    completed: { text: 'Finalizado', color: 'text-muted' },
    cancelled: { text: 'Cancelado', color: 'neon-orange' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-[var(--neon-blue)] border-t-transparent rounded-full spinner-chaos" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[var(--font-display)] text-4xl text-[var(--text-primary)] mb-4">
            Evento não encontrado
          </h1>
          <Link href="/eventos">
            <Button variant="neon">Voltar aos Eventos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const dateInfo = formatDate(event.date);
  const status = statusLabels[event.status];

  return (
    <>
      <MamacoComponents />
      <div className="min-h-screen bg-chaos py-12">
        <div className="container-chaos">
          {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-blue)] transition-colors mb-8 font-[var(--font-body)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar aos Eventos
          </Link>
        </motion.div>

        {/* Event Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Status Badge */}
          <div className={`inline-block px-4 py-2 bg-[var(--${status.color})]/10 border border-[var(--${status.color})] text-[var(--${status.color})] font-[var(--font-display)] text-sm uppercase tracking-wider mb-6`}>
            {status.text}
          </div>

          <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--text-primary)] mb-6">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[var(--text-muted)]">
            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-[var(--neon-blue)] flex items-center justify-center bg-[var(--neon-blue)]/10">
                <svg className="w-6 h-6 text-[var(--neon-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-[var(--font-display)] text-[var(--text-primary)] capitalize">
                  {dateInfo.full}
                </p>
                <p className="text-sm font-[var(--font-body)]">às {dateInfo.time}</p>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border-2 border-[var(--neon-pink)] flex items-center justify-center bg-[var(--neon-pink)]/10">
                  <svg className="w-6 h-6 text-[var(--neon-pink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-[var(--font-display)] text-[var(--text-primary)]">
                    {event.location}
                  </p>
                  <p className="text-sm font-[var(--font-body)]">Local do evento</p>
                </div>
              </div>
            )}

            {/* Organizer */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-[var(--neon-green)] flex items-center justify-center bg-[var(--neon-green)]/10">
                <span className="font-[var(--font-accent)] text-xl text-[var(--neon-green)]">
                  {event.createdBy.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-[var(--font-display)] text-[var(--text-primary)]">
                  {event.createdBy}
                </p>
                <p className="text-sm font-[var(--font-body)]">Organizador</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Description */}
        {event.description && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="divider-chaos w-full h-px mb-8" />
            <p className="text-[var(--text-secondary)] text-lg font-[var(--font-body)] leading-relaxed max-w-3xl">
              {event.description}
            </p>
          </motion.section>
        )}

        {/* Participants */}
        {event.participants && event.participants.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-12"
          >
            <div className="divider-chaos w-full h-px mb-8" />
            <ParticipantsList
              participants={event.participants}
              title="Quem Vai no Role"
              variant="default"
              size="md"
              linkToProfile
            />
          </motion.section>
        )}

        {/* Stories from this Event */}
        {event.stories && event.stories.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="divider-chaos w-full h-px mb-8" />

            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--text-primary)] mb-6">
              Histórias deste <span className="text-neon-green">Rolê</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.stories.map((story, index) => (
                <StoryCard key={story.id} story={story} index={index} />
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
          <Link href={`/historias/nova?eventId=${event.id}`}>
            <Button variant="neon" size="lg">
              + Contar História deste Rolê
            </Button>
          </Link>

          <Link href={`/eventos/${event.id}/editar`}>
            <Button variant="ghost" size="lg" className="text-[var(--neon-blue)] hover:border-[var(--neon-blue)]">
              Editar Evento
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="text-[var(--neon-orange)] hover:border-[var(--neon-orange)]"
          >
            Deletar Evento
          </Button>
        </motion.div>
        </div>
      </div>
    </>
  );
}
