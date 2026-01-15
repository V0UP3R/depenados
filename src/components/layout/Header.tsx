'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/historias', label: 'Histórias' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/membros', label: 'Membros' },
  { href: '/historias/nova', label: '+ Nova' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-[var(--z-header)]
        transition-all duration-300
        ${mounted ? 'translate-y-0' : '-translate-y-full'}
        ${isScrolled
          ? 'bg-[var(--void-black)]/95 backdrop-blur-sm border-b border-[var(--surface-elevated)]'
          : 'bg-transparent'
        }
      `}
      style={{ willChange: 'transform' }}
    >
      <nav className="container-chaos">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 group hover:scale-105 active:scale-95 transition-transform">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-[var(--neon-pink)] flex items-center justify-center group-hover:shadow-[0_0_20px_var(--neon-pink-glow)] transition-shadow">
                  <span className="font-[var(--font-accent)] text-2xl text-[var(--neon-pink)]">D</span>
                </div>
                {/* Minimalist monkey icon */}
                <svg
                  className="absolute -top-3 -right-3 w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  {/* Left ear outer */}
                  <circle cx="4.5" cy="9" r="4" fill="var(--neon-green)" />
                  {/* Left ear inner */}
                  <circle cx="4.5" cy="9" r="2" fill="var(--void-black)" />
                  {/* Right ear outer */}
                  <circle cx="19.5" cy="9" r="4" fill="var(--neon-green)" />
                  {/* Right ear inner */}
                  <circle cx="19.5" cy="9" r="2" fill="var(--void-black)" />
                  {/* Head */}
                  <circle cx="12" cy="12" r="9" fill="var(--neon-green)" />
                  {/* Face/muzzle area */}
                  <ellipse cx="12" cy="14.5" rx="5" ry="4" fill="var(--void-black)" />
                  {/* Left eye */}
                  <circle cx="9" cy="10" r="1.5" fill="var(--void-black)" />
                  {/* Right eye */}
                  <circle cx="15" cy="10" r="1.5" fill="var(--void-black)" />
                  {/* Nose */}
                  <circle cx="10.5" cy="14" r="1" fill="var(--neon-green)" />
                  <circle cx="13.5" cy="14" r="1" fill="var(--neon-green)" />
                  {/* Mouth */}
                  <path d="M10 16.5 Q12 18 14 16.5" stroke="var(--neon-green)" strokeWidth="0.8" fill="none" />
                </svg>
              </div>
              <span className="hidden sm:block font-[var(--font-display)] text-2xl tracking-wider text-neon-pink">
                DEPENADOS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`
                    relative px-4 py-2 font-[var(--font-display)] text-sm uppercase tracking-wider
                    transition-all duration-150 hover:-translate-y-0.5
                    ${pathname === link.href
                      ? 'text-[var(--neon-pink)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--neon-pink)] shadow-[0_0_10px_var(--neon-pink)]" />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border border-[var(--surface-elevated)] text-[var(--text-primary)] active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--surface-dark)] border-t border-[var(--surface-elevated)]"
          >
            <div className="container-chaos py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={link.href}>
                    <span
                      className={`
                        block py-3 px-4 font-[var(--font-display)] text-lg uppercase tracking-wider
                        border-l-2 transition-all
                        ${pathname === link.href
                          ? 'border-[var(--neon-pink)] text-[var(--neon-pink)] bg-[var(--neon-pink)]/5'
                          : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--neon-green)] hover:text-[var(--text-primary)]'
                        }
                      `}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
