'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { StoryGrid } from '@/components/stories';
import { useStoryStore } from '@/stores/story-store';
import type { StoryFilter } from '@/types/story';

const filters: { value: StoryFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'featured', label: 'Lendas' },
  { value: 'recent', label: 'Recentes' },
];

export default function HistoriasPage() {
  const { fetchStories, filter, setFilter, getFilteredStories, isLoading } = useStoryStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const filteredStories = getFilteredStories().filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-chaos">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Neon Grid Background */}
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Neon Glow Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--neon-green-glow) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--neon-pink-glow) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="container-chaos relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-[var(--font-display)] text-5xl md:text-7xl text-[var(--text-primary)] mb-4 glitch">
              <span className="text-neon-pink">ARQUIVO</span>{' '}
              <span className="text-neon-green">DO CAOS</span>
            </h1>
            <p className="font-[var(--font-accent)] text-xl md:text-2xl text-[var(--neon-yellow)] text-drunk">
              Onde cada ressaca vira lenda
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar nas mamacadas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-chaos w-full !pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <motion.button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`
                    px-4 py-2 font-[var(--font-display)] text-sm uppercase tracking-wider
                    border transition-all duration-150
                    ${filter === f.value
                      ? 'bg-[var(--neon-pink)] border-[var(--neon-pink)] text-[var(--void-black)] shadow-[0_0_20px_var(--neon-pink-glow)]'
                      : 'border-[var(--surface-elevated)] text-[var(--text-muted)] hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {f.label}
                </motion.button>
              ))}
            </div>

            {/* New Story Button */}
            <Link href="/historias/nova">
              <Button variant="neon" size="md" glitch>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Mamacada
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12 md:py-20 relative">
        <div className="container-chaos">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <p className="text-[var(--text-muted)] font-[var(--font-body)]">
              <span className="font-bold text-[var(--neon-green)]">{filteredStories.length}</span>{' '}
              {filteredStories.length === 1 ? 'mamacada encontrada' : 'mamacadas encontradas'}
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-2 border-[var(--neon-pink)] border-t-transparent rounded-full spinner-chaos" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StoryGrid stories={filteredStories} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
