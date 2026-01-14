'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { EventCard } from '@/components/events';
import { useEventStore } from '@/stores/event-store';
import type { EventStatus } from '@/types/story';

export default function EventsPage() {
  const { events, isLoading, fetchEvents } = useEventStore();
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = statusFilter === 'all'
    ? events
    : events.filter((e) => e.status === statusFilter);

  const filters: { value: EventStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'upcoming', label: 'Em breve' },
    { value: 'ongoing', label: 'Rolando' },
    { value: 'completed', label: 'Finalizados' },
    { value: 'cancelled', label: 'Cancelados' },
  ];

  return (
    <div className="min-h-screen bg-chaos py-12">
      <div className="container-chaos">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--text-primary)] mb-2">
                Próximos <span className="text-neon-blue">Rolês</span>
              </h1>
              <p className="text-[var(--text-muted)] font-[var(--font-body)]">
                Eventos marcados pela irmandade
              </p>
            </div>

            <Link href="/eventos/novo">
              <Button variant="neon" size="lg" glitch>
                + Criar Evento
              </Button>
            </Link>
          </div>

          <div className="divider-chaos w-32 h-1 mt-6" />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`
                px-4 py-2 font-[var(--font-display)] text-sm uppercase tracking-wider
                border transition-all
                ${statusFilter === filter.value
                  ? 'bg-[var(--neon-blue)] text-[var(--void-black)] border-[var(--neon-blue)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--surface-elevated)] hover:border-[var(--neon-blue)]'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-2 border-[var(--neon-blue)] border-t-transparent rounded-full spinner-chaos" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-8 border-2 border-[var(--surface-elevated)] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-grid opacity-30" />
              <svg
                className="w-16 h-16 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h3 className="font-[var(--font-display)] text-3xl text-[var(--text-primary)] mb-4 glitch">
              <span className="text-neon-blue">NENHUM</span>{' '}
              <span className="text-neon-pink">EVENTO</span>
            </h3>

            <p className="font-[var(--font-accent)] text-lg text-[var(--neon-yellow)] text-drunk mb-2">
              A agenda ta vazia...
            </p>

            <p className="text-[var(--text-muted)] font-[var(--font-body)] mb-8 max-w-md mx-auto">
              Nenhum rolê marcado ainda. Bora organizar o próximo caos?
            </p>

            <Link href="/eventos/novo">
              <Button variant="neon" size="lg" glitch>
                Criar Primeiro Evento
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
