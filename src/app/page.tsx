'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useStoryStore } from '@/stores/story-store';
import { ChaosCounter } from '@/components/counters';
import { UpcomingEvents } from '@/components/events';

export default function HomePage() {
  const { stories, fetchStories, isLoading } = useStoryStore();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const featuredStories = stories.filter((s) => s.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-chaos">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Animated Neon Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--neon-pink-glow) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--neon-green-glow) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Content */}
        <div className="container-chaos relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glitch Title */}
            <motion.h1
              className="font-[var(--font-display)] text-[clamp(4rem,15vw,12rem)] leading-none mb-4 glitch"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-neon-pink flicker">DEPENADOS</span>
            </motion.h1>

            {/* Subtitle with Marker Font */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-[var(--font-accent)] text-2xl md:text-4xl text-[var(--neon-yellow)] mb-8 text-drunk"
            >
              Mamacadas. Bebedeira. Brigas.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-[var(--font-body)] text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-12"
            >
              Onde cada noite vira lenda e cada ressaca tem uma história pra contar.
              Este é o arquivo sagrado das nossas aventuras.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/historias">
                <Button variant="neon" size="lg" glitch>
                  Ver Histórias
                </Button>
              </Link>
              <Link href="/historias/nova">
                <Button variant="ghost" size="lg">
                  + Contar uma
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Outside container, inside section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.div className="flex flex-col items-center gap-3">
            <span className="text-xs font-[var(--font-body)] text-[var(--text-muted)] uppercase tracking-widest">
              Desce aí
            </span>

            {/* Container da animação */}
            <svg width="80" height="90" viewBox="0 0 80 90" className="overflow-visible">
              {/* Garrafa - inclina pra direita */}
              <motion.g
                animate={{ rotate: [0, 0, 70, 70, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  times: [0, 0.15, 0.35, 0.8, 1],
                  ease: "easeInOut"
                }}
                style={{ transformOrigin: "20px 50px" }}
              >
                {/* Corpo da garrafa */}
                <path
                  d="M15 12 L15 20 L12 26 L12 52 C12 54 14 55 20 55 C26 55 28 54 28 52 L28 26 L25 20 L25 12 Z"
                  fill="var(--surface-card)"
                  stroke="var(--neon-pink)"
                  strokeWidth="2"
                />
                {/* Tampa */}
                <rect x="14" y="4" width="12" height="8" rx="2" fill="var(--neon-pink)" />
                {/* Gargalo */}
                <rect x="15" y="10" width="10" height="6" fill="var(--surface-card)" stroke="var(--neon-pink)" strokeWidth="1" />
                {/* Rótulo */}
                <rect x="14" y="30" width="12" height="14" rx="1" fill="var(--surface-elevated)" stroke="var(--neon-pink)" strokeWidth="1" />
                <text x="20" y="40" textAnchor="middle" fontSize="9" fill="var(--neon-pink)" fontWeight="bold">D</text>
                {/* Líquido dentro da garrafa */}
                <motion.path
                  d="M13 36 L13 51 C13 53 15 54 20 54 C25 54 27 53 27 51 L27 36 Z"
                  fill="var(--neon-yellow)"
                  animate={{ opacity: [0.9, 0.9, 0.3, 0.3, 0.9] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    times: [0, 0.15, 0.5, 0.8, 1]
                  }}
                  style={{ filter: "drop-shadow(0 0 3px var(--neon-yellow))" }}
                />
              </motion.g>

            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Chaos Counter Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[var(--surface-dark)]" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="container-chaos relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--text-primary)] mb-2">
              Placar dos <span className="text-neon-orange">Mamacos</span>
            </h2>
            <p className="text-[var(--text-muted)] font-[var(--font-body)] mb-4">
              Registros oficiais das baixas dos Depenados
            </p>
            <div className="divider-chaos w-32 h-1" />
          </motion.div>

          <ChaosCounter />
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-24 relative">
        <div className="container-chaos">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--text-primary)] mb-2">
              Últimas <span className="text-neon-green">Mamacadas</span>
            </h2>
            <div className="divider-chaos w-32 h-1" />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <motion.div
                className="w-16 h-16 border-2 border-[var(--neon-pink)] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : featuredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story, index) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-chaos group hover-lift"
                >
                  <Link href={`/historias/${story.id}`}>
                    {story.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-[var(--font-display)] text-xl text-[var(--text-primary)] mb-2 group-hover:text-[var(--neon-pink)] transition-colors">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-[var(--text-muted)] font-[var(--font-body)] text-sm line-clamp-2 mb-4">
                          {story.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--neon-green)] font-[var(--font-body)]">
                          {story.author}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
                          {new Date(story.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-[var(--font-display)] text-2xl text-[var(--text-muted)] mb-4">
                Nenhuma história ainda...
              </p>
              <p className="text-[var(--text-muted)] font-[var(--font-body)] mb-8">
                Seja o primeiro a documentar a mamacada!
              </p>
              <Link href="/historias/nova">
                <Button variant="neon">Criar Primeira História</Button>
              </Link>
            </motion.div>
          )}

          {featuredStories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/historias">
                <Button variant="ghost" size="lg">
                  Ver Todas →
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[var(--surface-dark)]" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="container-chaos relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Title and description */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--text-primary)] mb-4">
                Próximos <span className="text-neon-blue">Rolês</span>
              </h2>
              <p className="text-[var(--text-muted)] font-[var(--font-body)] mb-6">
                Eventos marcados pela irmandade. Não perca o próximo caos!
              </p>
              <div className="divider-chaos w-32 h-1" />
            </motion.div>

            {/* Right: Events list */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <UpcomingEvents />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--surface-card)]" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="container-chaos relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[var(--font-accent)] text-3xl md:text-5xl text-[var(--neon-yellow)] mb-8 text-drunk">
                &ldquo;Não somos um grupo.
                <br />
                Somos macacos que se suportam.&rdquo;
              </h2>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {['#bebedeira', '#mamacada', '#irmandade', '#caos', '#ressaca'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`tag-chaos ${
                      i % 3 === 0
                        ? 'text-[var(--neon-pink)]'
                        : i % 3 === 1
                        ? 'text-[var(--neon-green)]'
                        : 'text-[var(--neon-yellow)]'
                    }`}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              <Link href="/historias/nova">
                <Button variant="neon" size="lg" glitch>
                  Adicionar sua História
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
