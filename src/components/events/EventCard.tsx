'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Event } from '@/types/story';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
    };
  };

  const dateInfo = formatDate(event.date);
  const isPast = new Date(event.date) < new Date();

  const statusColors = {
    upcoming: 'neon-blue',
    ongoing: 'neon-green',
    completed: 'text-muted',
    cancelled: 'neon-orange',
  };

  const statusLabels = {
    upcoming: 'Em breve',
    ongoing: 'Rolando',
    completed: 'Finalizado',
    cancelled: 'Cancelado',
  };

  const color = statusColors[event.status] || 'neon-blue';

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
    >
      <Link href={`/eventos/${event.id}`}>
        <motion.div
          className={`card-chaos group hover-lift overflow-hidden ${isPast ? 'opacity-70' : ''}`}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cover Image or Date Display */}
          <div className="relative h-40 overflow-hidden">
            {event.coverImage ? (
              <>
                <motion.img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-transparent to-transparent" />
              </>
            ) : (
              <div className={`w-full h-full bg-[var(--${color})]/10 flex items-center justify-center relative`}>
                <div className="text-center">
                  <span className={`block font-[var(--font-display)] text-6xl text-[var(--${color})]`}>
                    {dateInfo.day}
                  </span>
                  <span className={`block font-[var(--font-body)] text-lg text-[var(--${color})]`}>
                    {dateInfo.month}
                  </span>
                </div>
                <div className="absolute inset-0 bg-grid opacity-20" />
              </div>
            )}

            {/* Status Badge */}
            <motion.div
              className={`absolute top-4 right-4 px-3 py-1 bg-[var(--void-black)] text-[var(--${color})] border border-[var(--${color})] text-xs font-[var(--font-display)] uppercase tracking-wider`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {statusLabels[event.status]}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs text-[var(--${color})] font-[var(--font-body)]`}>
                {dateInfo.time}
              </span>
              <span className="w-1 h-1 bg-[var(--neon-pink)]" />
              <span className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
                {dateInfo.full}
              </span>
            </div>

            <h3 className={`font-[var(--font-display)] text-xl md:text-2xl text-[var(--text-primary)] mb-3 group-hover:text-[var(--${color})] transition-colors line-clamp-2`}>
              {event.title}
            </h3>

            {event.location && (
              <p className="text-[var(--text-muted)] font-[var(--font-body)] text-sm flex items-center gap-2 mb-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </p>
            )}

            {event.description && (
              <p className="text-[var(--text-muted)] font-[var(--font-body)] text-sm leading-relaxed line-clamp-2 mb-4">
                {event.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--surface-elevated)]">
              <span className="text-xs text-[var(--neon-green)] font-[var(--font-body)]">
                Por {event.createdBy}
              </span>
              {event._count && (
                <span className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
                  {event._count.stories} história{event._count.stories !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Neon Border Glow on Hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[var(--${color})] shadow-[0_0_20px_var(--${color}-glow)]`} />
        </motion.div>
      </Link>
    </motion.article>
  );
}
