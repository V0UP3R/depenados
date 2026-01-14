'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Member } from '@/types/story';

interface MemberCardProps {
  member: Member & {
    _count?: {
      storiesAuthored: number;
      storiesIn: number;
      eventsCreated: number;
      eventsIn: number;
    };
  };
  index?: number;
}

export function MemberCard({ member, index = 0 }: MemberCardProps) {
  const totalStories = (member._count?.storiesAuthored || 0) + (member._count?.storiesIn || 0);
  const totalEvents = (member._count?.eventsCreated || 0) + (member._count?.eventsIn || 0);

  return (
    <Link href={`/membros/${member.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative bg-[var(--surface-card)] border border-[var(--surface-elevated)] overflow-hidden hover:border-[var(--neon-green)] transition-all duration-300"
      >
        {/* Avatar Section */}
        <div className="relative aspect-square overflow-hidden">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.nickname}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-[var(--surface-dark)] flex items-center justify-center">
              <span className="font-[var(--font-accent)] text-6xl text-[var(--neon-green)]">
                {member.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-transparent to-transparent opacity-80" />

          {/* Role badge */}
          {member.role && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--void-black)]/80 border border-[var(--neon-yellow)] text-[var(--neon-yellow)] text-xs font-[var(--font-display)] uppercase tracking-wider">
              {member.role}
            </div>
          )}

          {/* Scan line effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity scan-line pointer-events-none" />
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="font-[var(--font-display)] text-xl text-[var(--text-primary)] mb-1 group-hover:text-[var(--neon-green)] transition-colors">
            {member.nickname}
          </h3>
          <p className="text-sm text-[var(--text-muted)] font-[var(--font-body)] mb-3">
            {member.name}
          </p>

          {/* Stats */}
          <div className="flex gap-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1">
              <span className="text-[var(--neon-pink)]">{totalStories}</span>
              <span>historias</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[var(--neon-blue)]">{totalEvents}</span>
              <span>eventos</span>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 shadow-[inset_0_0_30px_var(--neon-green-glow)]" />
        </div>
      </motion.article>
    </Link>
  );
}
