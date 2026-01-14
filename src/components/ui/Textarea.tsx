'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-[var(--font-display)] text-sm uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        {hint && (
          <span className="text-xs text-[var(--text-muted)] font-[var(--font-body)] -mt-1">
            {hint}
          </span>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            input-chaos resize-y min-h-[150px]
            ${error ? 'border-[var(--neon-orange)]! shadow-[0_0_10px_var(--neon-orange-glow)]' : ''}
            ${className}
          `}
          {...props}
        />
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
);

Textarea.displayName = 'Textarea';
