'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { StoryView } from '@/components/stories';
import { useStoryStore } from '@/stores/story-store';
import type { Story } from '@/types/story';

export default function HistoriaPage() {
  const params = useParams();
  const router = useRouter();
  const fetchStoryById = useStoryStore((state) => state.fetchStoryById);
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      const id = params.id as string;
      const foundStory = await fetchStoryById(id);
      setStory(foundStory);
      setIsLoading(false);
    };
    loadStory();
  }, [params.id, fetchStoryById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 border-2 border-[var(--neon-pink)] border-t-transparent mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-[var(--neon-pink)] font-[var(--font-display)] uppercase tracking-wider flicker">
            Carregando a mamacada...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-8 border-2 border-[var(--neon-orange)] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[var(--neon-orange)]/10" />
            <svg
              className="w-16 h-16 text-[var(--neon-orange)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="font-[var(--font-display)] text-3xl text-[var(--text-primary)] mb-4 glitch">
            <span className="text-neon-orange">ERRO 404</span>
          </h2>

          <p className="font-[var(--font-accent)] text-xl text-[var(--neon-yellow)] text-drunk mb-2">
            Historia nao encontrada
          </p>

          <p className="text-[var(--text-muted)] font-[var(--font-body)] mb-8 max-w-md mx-auto">
            Essa mamacada pode ter sido apagada pela bebedeira,
            ou nunca existiu na realidade paralela dos Depenados.
          </p>

          <Link href="/historias">
            <Button variant="neon" size="lg" glitch>
              Voltar pro Caos
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chaos py-24 md:py-32">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none" />

      <div className="container-chaos relative z-10">
        <StoryView story={story} />
      </div>
    </div>
  );
}
