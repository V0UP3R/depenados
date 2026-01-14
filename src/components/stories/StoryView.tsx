'use client';

import { motion } from 'framer-motion';
import type { Story } from '@/types/story';
import { ParticipantsList } from '@/components/ui';

interface StoryViewProps {
  story: Story;
}

export function StoryView({ story }: StoryViewProps) {
  const formattedDate = new Date(story.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative mb-12"
      >
        {story.coverImage && (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[40vh] md:h-[50vh] overflow-hidden mb-8"
          >
            <img
              src={story.coverImage}
              alt={story.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-[var(--void-black)]/50 to-transparent" />
            <div className="absolute inset-0 scan-line opacity-30" />

            {/* Neon border frame */}
            <div className="absolute inset-4 border border-[var(--neon-pink)]/30 pointer-events-none" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={story.coverImage ? 'relative -mt-32 px-4 md:px-8' : ''}
        >
          {/* Featured Badge */}
          {story.featured && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-[var(--neon-yellow)] text-[var(--void-black)] font-[var(--font-display)] text-sm uppercase tracking-wider">
                Lenda dos Depenados
              </span>
            </motion.div>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {story.tags.map((tag, i) => (
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

          {/* Title */}
          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] mb-6 leading-tight glitch">
            {story.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-[var(--neon-green)] flex items-center justify-center bg-[var(--neon-green)]/10">
                <span className="font-[var(--font-accent)] text-xl text-[var(--neon-green)]">
                  {story.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-[var(--font-display)] text-[var(--text-primary)] uppercase tracking-wider">
                  {story.author}
                </p>
                <p className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
                  Contador de historias
                </p>
              </div>
            </div>
            <span className="w-1 h-1 bg-[var(--neon-pink)]" />
            <span className="font-[var(--font-body)] text-sm">
              {formattedDate}
            </span>
          </div>
        </motion.div>
      </motion.header>

      {/* Divider */}
      <div className="divider-chaos w-full h-px mb-12" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="prose prose-invert max-w-none"
      >
        <div className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed font-[var(--font-body)]">
          {story.content.split('\n\n').map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="mb-6"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Media Gallery */}
      {story.media && story.media.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-[var(--font-display)] text-2xl text-[var(--text-primary)] uppercase tracking-wider">
              Provas do <span className="text-neon-pink">Crime</span>
            </h2>
            <div className="flex-1 divider-chaos h-px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.media.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden aspect-video group"
              >
                <div className="absolute inset-0 border border-[var(--surface-elevated)] group-hover:border-[var(--neon-pink)] transition-colors" />

                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.caption || 'Prova da mamacada'}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : item.type === 'video' ? (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--surface-dark)] flex flex-col items-center justify-center p-4">
                    <svg className="w-16 h-16 text-[var(--neon-purple)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <audio src={item.url} controls className="w-full max-w-xs" />
                  </div>
                )}

                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--void-black)] to-transparent">
                    <p className="text-[var(--text-primary)] text-sm font-[var(--font-body)]">
                      {item.caption}
                    </p>
                  </div>
                )}

                {item.type === 'video' && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[var(--void-black)] border border-[var(--neon-blue)] text-[var(--neon-blue)] text-xs font-[var(--font-body)]">
                    VIDEO
                  </div>
                )}

                {item.type === 'audio' && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[var(--void-black)] border border-[var(--neon-purple)] text-[var(--neon-purple)] text-xs font-[var(--font-body)]">
                    AUDIO
                  </div>
                )}

                {/* Scan line on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity scan-line pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Participants Section */}
      {story.participants && story.participants.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <ParticipantsList
            participants={story.participants}
            title="Quem Estava na Mamacada"
            variant="default"
            size="md"
            linkToProfile
          />
        </motion.section>
      )}

    </article>
  );
}
