'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useEventStore } from '@/stores/event-store';

export function UpcomingEvents() {
  const { events, isLoading, fetchEvents, getUpcomingEvents } = useEventStore();

  useEffect(() => {
    fetchEvents({ upcoming: true });
  }, [fetchEvents]);

  const upcomingEvents = getUpcomingEvents();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          className="w-12 h-12 border-2 border-[var(--neon-blue)] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 border-2 border-[var(--surface-elevated)] flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="font-[var(--font-display)] text-xl text-[var(--text-muted)] mb-2">
          Nenhum rolê marcado
        </p>
        <p className="text-[var(--text-muted)] font-[var(--font-body)] text-sm mb-6">
          Bora marcar o próximo caos?
        </p>
        <Link href="/eventos/novo">
          <Button variant="neon" size="sm">
            Criar Evento
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingEvents.map((event, index) => {
        const dateInfo = formatDate(event.date);
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/eventos/${event.id}`}>
              <motion.div
                className="flex items-stretch gap-4 p-4 border border-[var(--surface-elevated)] bg-[var(--surface-card)] hover:border-[var(--neon-blue)] transition-all group"
                whileHover={{ x: 5 }}
              >
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center w-20 py-2 bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30">
                  <span className="text-xs text-[var(--neon-blue)] font-[var(--font-body)]">
                    {dateInfo.month}
                  </span>
                  <span className="font-[var(--font-display)] text-3xl text-[var(--neon-blue)]">
                    {dateInfo.day}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
                    {dateInfo.time}
                  </span>
                </div>

                {/* Event Info */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h4 className="font-[var(--font-display)] text-lg text-[var(--text-primary)] group-hover:text-[var(--neon-blue)] transition-colors truncate">
                    {event.title}
                  </h4>
                  {event.location && (
                    <p className="text-sm text-[var(--text-muted)] font-[var(--font-body)] flex items-center gap-1 truncate">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                  )}
                  {event._count && event._count.stories > 0 && (
                    <p className="text-xs text-[var(--neon-green)] font-[var(--font-body)] mt-1">
                      {event._count.stories} história{event._count.stories > 1 ? 's' : ''} já
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-[var(--text-muted)] group-hover:text-[var(--neon-blue)] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex gap-4 pt-4"
      >
        <Link href="/eventos" className="flex-1">
          <Button variant="ghost" size="sm" className="w-full">
            Ver Todos
          </Button>
        </Link>
        <Link href="/eventos/novo" className="flex-1">
          <Button variant="neon" size="sm" className="w-full">
            + Criar Evento
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
