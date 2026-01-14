'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Member } from '@/types/story';

interface ParticipantsListProps {
  participants: Member[];
  title?: string;
  showTitle?: boolean;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'stacked';
  linkToProfile?: boolean;
}

const sizeClasses = {
  sm: {
    avatar: 'w-8 h-8',
    text: 'text-xs',
    gap: 'gap-2',
    stackOffset: '-ml-2',
  },
  md: {
    avatar: 'w-10 h-10',
    text: 'text-sm',
    gap: 'gap-3',
    stackOffset: '-ml-3',
  },
  lg: {
    avatar: 'w-12 h-12',
    text: 'text-base',
    gap: 'gap-4',
    stackOffset: '-ml-4',
  },
};

const neonColors = [
  'neon-green',
  'neon-pink',
  'neon-blue',
  'neon-yellow',
  'neon-purple',
  'neon-orange',
];

export function ParticipantsList({
  participants,
  title = 'Participantes da Mamacada',
  showTitle = true,
  maxVisible = 10,
  size = 'md',
  variant = 'default',
  linkToProfile = true,
}: ParticipantsListProps) {
  if (!participants || participants.length === 0) {
    return null;
  }

  const visibleParticipants = participants.slice(0, maxVisible);
  const remainingCount = participants.length - maxVisible;
  const classes = sizeClasses[size];

  const renderAvatar = (member: Member, index: number) => {
    const neonColor = neonColors[index % neonColors.length];

    const avatar = (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.1, zIndex: 10 }}
        className={`
          ${classes.avatar} rounded-full overflow-hidden border-2 flex-shrink-0
          border-[var(--${neonColor})] shadow-[0_0_10px_var(--${neonColor}-glow)]
          transition-all duration-200 relative
          ${variant === 'stacked' && index > 0 ? classes.stackOffset : ''}
        `}
        style={{ zIndex: participants.length - index }}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.nickname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-[var(--${neonColor})]/20 flex items-center justify-center`}>
            <span className={`text-[var(--${neonColor})] font-[var(--font-accent)] ${classes.text}`}>
              {member.nickname.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </motion.div>
    );

    if (linkToProfile) {
      return (
        <Link
          key={member.id}
          href={`/membros/${member.id}`}
          className="group relative"
          title={member.nickname}
        >
          {avatar}
          {/* Tooltip */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <div className={`
              px-2 py-1 bg-[var(--void-black)] border border-[var(--${neonColor})]
              text-[var(--${neonColor})] ${classes.text} font-[var(--font-display)]
              whitespace-nowrap uppercase tracking-wider
            `}>
              {member.nickname}
            </div>
          </div>
        </Link>
      );
    }

    return <div key={member.id} title={member.nickname}>{avatar}</div>;
  };

  // Stacked variant - avatares sobrepostos
  if (variant === 'stacked') {
    return (
      <div className="flex flex-col gap-2">
        {showTitle && (
          <span className="font-[var(--font-display)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
            {title}
          </span>
        )}
        <div className="flex items-center">
          <div className="flex items-center">
            {visibleParticipants.map((member, index) => renderAvatar(member, index))}
          </div>
          {remainingCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`
                ${classes.avatar} rounded-full bg-[var(--surface-elevated)]
                border-2 border-[var(--text-muted)] flex items-center justify-center
                ${classes.stackOffset}
              `}
              style={{ zIndex: 0 }}
            >
              <span className={`text-[var(--text-muted)] ${classes.text} font-[var(--font-display)]`}>
                +{remainingCount}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Compact variant - apenas avatares em linha
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center ${classes.gap}`}>
        {showTitle && (
          <span className="font-[var(--font-display)] text-xs uppercase tracking-wider text-[var(--text-muted)] mr-2">
            {title}:
          </span>
        )}
        {visibleParticipants.map((member, index) => renderAvatar(member, index))}
        {remainingCount > 0 && (
          <span className={`text-[var(--text-muted)] ${classes.text} font-[var(--font-body)]`}>
            +{remainingCount} mais
          </span>
        )}
      </div>
    );
  }

  // Default variant - cards completos
  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center gap-4">
          <h3 className="font-[var(--font-display)] text-lg text-[var(--text-primary)] uppercase tracking-wider">
            {title}
          </h3>
          <span className="px-2 py-1 bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)] text-[var(--neon-purple)] text-xs font-[var(--font-display)]">
            {participants.length}
          </span>
          <div className="flex-1 divider-chaos h-px" />
        </div>
      )}

      <div className={`flex flex-wrap ${classes.gap}`}>
        {visibleParticipants.map((member, index) => {
          const neonColor = neonColors[index % neonColors.length];

          const card = (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`
                flex items-center ${classes.gap} p-3
                bg-[var(--surface-card)] border border-[var(--surface-elevated)]
                hover:border-[var(--${neonColor})] transition-all group
              `}
            >
              {/* Avatar */}
              <div className={`
                ${classes.avatar} rounded-full overflow-hidden border-2 flex-shrink-0
                border-[var(--${neonColor})]/50 group-hover:border-[var(--${neonColor})]
                group-hover:shadow-[0_0_15px_var(--${neonColor}-glow)] transition-all
              `}>
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-[var(--${neonColor})]/20 flex items-center justify-center`}>
                    <span className={`text-[var(--${neonColor})] font-[var(--font-accent)] ${classes.text}`}>
                      {member.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p className={`
                  font-[var(--font-display)] ${classes.text} uppercase tracking-wider truncate
                  text-[var(--text-primary)] group-hover:text-[var(--${neonColor})] transition-colors
                `}>
                  {member.nickname}
                </p>
                {member.role && (
                  <p className="text-xs text-[var(--text-muted)] font-[var(--font-body)] truncate">
                    {member.role}
                  </p>
                )}
              </div>
            </motion.div>
          );

          if (linkToProfile) {
            return (
              <Link key={member.id} href={`/membros/${member.id}`}>
                {card}
              </Link>
            );
          }

          return card;
        })}

        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`
              flex items-center justify-center p-3 min-w-[120px]
              bg-[var(--surface-card)] border border-dashed border-[var(--text-muted)]
            `}
          >
            <span className="text-[var(--text-muted)] text-sm font-[var(--font-display)]">
              +{remainingCount} membros
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
