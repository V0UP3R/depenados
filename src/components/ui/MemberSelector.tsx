'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemberStore } from '@/stores/member-store';
import type { Member } from '@/types/story';

interface MemberSelectorProps {
  label?: string;
  hint?: string;
  error?: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  maxSelection?: number;
}

export function MemberSelector({
  label,
  hint,
  error,
  selectedIds,
  onChange,
  placeholder = 'Buscar membros...',
  maxSelection,
}: MemberSelectorProps) {
  const { members, fetchMembers, isLoading } = useMemberStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (members.length === 0) {
      fetchMembers();
    }
  }, [members.length, fetchMembers]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.nickname.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMembers = members.filter((m) => selectedIds.includes(m.id));

  const toggleMember = (memberId: string) => {
    if (selectedIds.includes(memberId)) {
      onChange(selectedIds.filter((id) => id !== memberId));
    } else {
      if (maxSelection && selectedIds.length >= maxSelection) return;
      onChange([...selectedIds, memberId]);
    }
  };

  const removeMember = (memberId: string) => {
    onChange(selectedIds.filter((id) => id !== memberId));
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      {label && (
        <label className="font-[var(--font-display)] text-sm uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      {hint && (
        <span className="text-xs text-[var(--text-muted)] font-[var(--font-body)] -mt-1">
          {hint}
        </span>
      )}

      {/* Selected Members */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          <AnimatePresence mode="popLayout">
            {selectedMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-card)] border border-[var(--neon-green)]/50 group hover:border-[var(--neon-orange)] transition-colors"
              >
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--neon-green)]/50 flex-shrink-0">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                      <span className="text-[var(--neon-green)] text-xs font-[var(--font-accent)]">
                        {member.nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[var(--text-primary)] text-sm font-[var(--font-body)]">
                  {member.nickname}
                </span>
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="ml-1 text-[var(--text-muted)] hover:text-[var(--neon-orange)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`
            input-chaos w-full
            ${error ? 'border-[var(--neon-orange)]! shadow-[0_0_10px_var(--neon-orange-glow)]' : ''}
          `}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-[var(--neon-blue)] border-t-transparent rounded-full spinner-chaos" />
          )}
          <svg
            className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-50 mt-1 max-h-64 overflow-y-auto bg-[var(--surface-card)] border border-[var(--surface-elevated)] shadow-xl"
          >
            {filteredMembers.length === 0 ? (
              <div className="p-4 text-center text-[var(--text-muted)] font-[var(--font-body)]">
                {members.length === 0 ? 'Nenhum membro cadastrado' : 'Nenhum membro encontrado'}
              </div>
            ) : (
              filteredMembers.map((member) => {
                const isSelected = selectedIds.includes(member.id);
                const isDisabled = !isSelected && maxSelection && selectedIds.length >= maxSelection;

                return (
                  <motion.button
                    key={member.id}
                    type="button"
                    onClick={() => !isDisabled && toggleMember(member.id)}
                    disabled={!!isDisabled}
                    className={`
                      w-full flex items-center gap-3 p-3 text-left transition-all
                      ${isSelected
                        ? 'bg-[var(--neon-green)]/10 border-l-2 border-[var(--neon-green)]'
                        : 'hover:bg-[var(--surface-elevated)] border-l-2 border-transparent'}
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    whileHover={!isDisabled ? { x: 4 } : {}}
                  >
                    {/* Avatar */}
                    <div className={`
                      w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 transition-colors
                      ${isSelected ? 'border-[var(--neon-green)]' : 'border-[var(--surface-elevated)]'}
                    `}>
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`
                          w-full h-full flex items-center justify-center
                          ${isSelected ? 'bg-[var(--neon-green)]/20' : 'bg-[var(--surface-elevated)]'}
                        `}>
                          <span className={`
                            text-lg font-[var(--font-accent)]
                            ${isSelected ? 'text-[var(--neon-green)]' : 'text-[var(--text-muted)]'}
                          `}>
                            {member.nickname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`
                        font-[var(--font-display)] text-sm uppercase tracking-wider truncate
                        ${isSelected ? 'text-[var(--neon-green)]' : 'text-[var(--text-primary)]'}
                      `}>
                        {member.nickname}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-[var(--font-body)] truncate">
                        {member.name}
                        {member.role && ` • ${member.role}`}
                      </p>
                    </div>

                    {/* Check */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-[var(--neon-green)] flex items-center justify-center flex-shrink-0"
                      >
                        <svg className="w-4 h-4 text-[var(--void-black)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-[var(--neon-orange)] font-[var(--font-body)]"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
