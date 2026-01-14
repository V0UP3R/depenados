'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-[var(--surface-elevated)]">
      {/* Neon line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--neon-pink)] to-transparent shadow-[0_0_20px_var(--neon-pink)]" />

      <div className="container-chaos py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border-2 border-[var(--neon-pink)] flex items-center justify-center">
                <span className="font-[var(--font-accent)] text-xl text-[var(--neon-pink)]">D</span>
              </div>
              <span className="font-[var(--font-display)] text-xl tracking-wider text-neon-pink">
                DEPENADOS
              </span>
            </div>
            <p className="text-[var(--text-muted)] font-[var(--font-body)] text-sm leading-relaxed">
              Onde a mamacada vira história. <br />
              Cada encontro vira uma briga.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-[var(--font-display)] text-lg uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Navegação
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Início' },
                { href: '/historias', label: 'Histórias' },
                { href: '/eventos', label: 'Eventos' },
                { href: '/membros', label: 'Membros' },
                { href: '/historias/nova', label: 'Nova História' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-muted)] hover:text-[var(--neon-green)] transition-colors font-[var(--font-body)] text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Manifesto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-[var(--font-display)] text-lg uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Manifesto
            </h4>
            <p className="text-[var(--text-muted)] font-[var(--font-body)] text-sm leading-relaxed italic">
              &ldquo;O maior inimigo do homem é o cigarro mas o homem que foge de seus inimigos é um covarde.&rdquo;
            </p>
            <div className="mt-4 flex gap-2">
              <span className="tag-chaos text-[var(--neon-pink)]">#mamacada</span>
              <span className="tag-chaos text-[var(--neon-green)]">#irmandade</span>
              <span className="tag-chaos text-[var(--neon-yellow)]">#caos</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-[var(--surface-elevated)] text-center"
        >
          <p className="text-xs text-[var(--text-muted)] font-[var(--font-body)]">
            {new Date().getFullYear()} DEPENADOS • Feito com ressaca e amor
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
