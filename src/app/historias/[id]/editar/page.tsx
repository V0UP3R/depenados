'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StoryForm } from '@/components/stories';
import { useStoryStore } from '@/stores/story-store';
import type { Story } from '@/types/story';

export default function EditStoryPage() {
  const params = useParams();
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
            className="w-16 h-16 border-2 border-[var(--neon-pink)] border-t-transparent mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-[var(--neon-pink)] font-[var(--font-display)] uppercase tracking-wider">
            Carregando historia...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-chaos flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--neon-orange)] mb-4">
            Historia nao encontrada
          </h2>
          <Link href="/historias" className="text-[var(--neon-pink)] hover:underline">
            Voltar as historias
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
            href={`/historias/${story.id}`}
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-pink)] transition-colors mb-6 font-[var(--font-body)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar pra Historia
          </Link>

          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--text-primary)] mb-2">
            Editar <span className="text-neon-pink">Historia</span>
          </h1>
          <p className="text-[var(--text-muted)] font-[var(--font-body)]">
            Corrigir os fatos ou adicionar mais caos
          </p>
          <div className="divider-chaos w-32 h-1 mt-4" />
        </motion.div>

        {/* Form */}
        <StoryForm
          initialData={{
            id: story.id,
            title: story.title,
            content: story.content,
            excerpt: story.excerpt,
            author: story.author,
            tags: story.tags?.join(', '),
            featured: story.featured,
            media: story.media,
            participants: story.participants,
          }}
          mode="edit"
        />
      </div>
    </div>
  );
}
