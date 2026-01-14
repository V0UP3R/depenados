'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { StoryCard } from './StoryCard';
import type { Story } from '@/types/story';

interface StoryGridProps {
  stories: Story[];
}

export function StoryGrid({ stories }: StoryGridProps) {
  if (stories.length === 0) {
    return (
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        <h3 className="font-[var(--font-display)] text-3xl text-[var(--text-primary)] mb-4 glitch">
          <span className="text-neon-pink">NENHUMA</span>{' '}
          <span className="text-neon-green">MAMACADA</span>
        </h3>

        <p className="font-[var(--font-accent)] text-lg text-[var(--neon-yellow)] text-drunk mb-2">
          O arquivo ta vazio...
        </p>

        <p className="text-[var(--text-muted)] font-[var(--font-body)] mb-8 max-w-md mx-auto">
          As historias dos Depenados ainda nao foram documentadas aqui.
          Seja o primeiro a quebrar o silencio!
        </p>

        <Link href="/historias/nova">
          <Button variant="neon" size="lg" glitch>
            Criar Primeira Historia
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {stories.map((story, index) => (
        <StoryCard key={story.id} story={story} index={index} />
      ))}
    </div>
  );
}
