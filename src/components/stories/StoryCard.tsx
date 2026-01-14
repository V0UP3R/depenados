'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Story } from '@/types/story';

interface StoryCardProps {
  story: Story;
  index?: number;
}

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  const formattedDate = new Date(story.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

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
      <Link href={`/historias/${story.id}`}>
        <motion.div
          className="card-chaos group hover-lift overflow-hidden"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cover Image */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            {story.coverImage ? (
              <>
                <motion.img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-purple)]/20 flex items-center justify-center relative">
                <span className="font-[var(--font-display)] text-8xl text-[var(--neon-pink)]/20">D</span>
                <div className="absolute inset-0 bg-grid opacity-30" />
              </div>
            )}

            {/* Featured Badge */}
            {story.featured && (
              <motion.div
                className="absolute top-4 right-4 px-3 py-1 bg-[var(--neon-yellow)] text-[var(--void-black)] text-xs font-[var(--font-display)] uppercase tracking-wider"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Lenda
              </motion.div>
            )}

            {/* Scan Line Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity scan-line pointer-events-none" />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
                {formattedDate}
              </span>
              <span className="w-1 h-1 bg-[var(--neon-pink)]" />
              <span className="text-xs text-[var(--neon-green)] font-[var(--font-body)]">
                {story.author}
              </span>
            </div>

            <h3 className="font-[var(--font-display)] text-xl md:text-2xl text-[var(--text-primary)] mb-3 group-hover:text-[var(--neon-pink)] transition-colors line-clamp-2">
              {story.title}
            </h3>

            {story.excerpt && (
              <p className="text-[var(--text-muted)] font-[var(--font-body)] text-sm leading-relaxed line-clamp-2 mb-4">
                {story.excerpt}
              </p>
            )}

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {story.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={tag}
                    className={`tag-chaos ${
                      i % 3 === 0
                        ? 'text-[var(--neon-pink)]'
                        : i % 3 === 1
                        ? 'text-[var(--neon-green)]'
                        : 'text-[var(--neon-yellow)]'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Read More */}
            <motion.div
              className="flex items-center gap-2 text-[var(--neon-pink)] font-[var(--font-display)] text-sm uppercase tracking-wider"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <span>Ver mamacada</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </div>

          {/* Neon Border Glow on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[var(--neon-pink)] shadow-[0_0_20px_var(--neon-pink-glow)]" />
        </motion.div>
      </Link>
    </motion.article>
  );
}
