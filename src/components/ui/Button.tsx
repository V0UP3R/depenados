'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

type ButtonVariant = 'neon' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  glitch?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  neon: `
    border-2 border-[var(--neon-pink)] text-[var(--neon-pink)]
    hover:bg-[var(--neon-pink)] hover:text-[var(--void-black)]
    hover:shadow-[0_0_20px_var(--neon-pink),0_0_40px_var(--neon-pink-glow)]
  `,
  ghost: `
    border-2 border-[var(--surface-elevated)] text-[var(--text-secondary)]
    hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]
    hover:shadow-[0_0_10px_var(--neon-green-glow)]
  `,
  danger: `
    border-2 border-[var(--neon-orange)] text-[var(--neon-orange)]
    hover:bg-[var(--neon-orange)] hover:text-[var(--void-black)]
    hover:shadow-[0_0_20px_var(--neon-orange),0_0_40px_var(--neon-orange-glow)]
  `,
  success: `
    border-2 border-[var(--neon-green)] text-[var(--neon-green)]
    hover:bg-[var(--neon-green)] hover:text-[var(--void-black)]
    hover:shadow-[0_0_20px_var(--neon-green),0_0_40px_var(--neon-green-glow)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'neon',
      size = 'md',
      isLoading = false,
      glitch = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={`
          relative overflow-hidden
          font-[var(--font-display)] uppercase tracking-widest
          bg-transparent cursor-pointer
          transition-all duration-150 ease-out
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${glitch ? 'glitch' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full spinner-chaos" />
        ) : (
          <span className="relative z-10">{children}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
