'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EventForm } from '@/components/events';
import type { Event } from '@/types/story';

export default function EditEventPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        }
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
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
          <div className="w-16 h-16 border-2 border-[var(--neon-blue)] border-t-transparent rounded-full mx-auto mb-4 spinner-chaos" />
          <p className="text-[var(--neon-blue)] font-[var(--font-display)] uppercase tracking-wider">
            Carregando evento...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--neon-orange)] mb-4">
            Evento nao encontrado
          </h2>
          <Link href="/eventos" className="text-[var(--neon-blue)] hover:underline">
            Voltar aos eventos
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
            href={`/eventos/${event.id}`}
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-blue)] transition-colors mb-6 font-[var(--font-body)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar pro Evento
          </Link>

          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--text-primary)] mb-2">
            Editar <span className="text-neon-blue">Evento</span>
          </h1>
          <p className="text-[var(--text-muted)] font-[var(--font-body)]">
            Atualize os detalhes do role
          </p>
          <div className="divider-chaos w-32 h-1 mt-4" />
        </motion.div>

        {/* Form */}
        <EventForm initialData={event} mode="edit" />
      </div>
    </div>
  );
}
