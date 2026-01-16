'use client';

import { forwardRef, useRef, useCallback, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  voiceEnabled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, voiceEnabled = true, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    const internalRef = useRef<HTMLInputElement | null>(null);

    const handleVoiceResult = useCallback((transcript: string) => {
      const input = internalRef.current;
      if (!input) return;

      // Adiciona o texto transcrito ao valor atual
      const currentValue = input.value;
      const selectionStart = input.selectionStart ?? currentValue.length;
      const selectionEnd = input.selectionEnd ?? currentValue.length;

      const newValue =
        currentValue.slice(0, selectionStart) +
        transcript +
        currentValue.slice(selectionEnd);

      // Define o novo valor
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, newValue);
      }

      // Dispara evento de input para React Hook Form detectar
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);

      // Move o cursor para depois do texto inserido
      const newCursorPosition = selectionStart + transcript.length;
      input.setSelectionRange(newCursorPosition, newCursorPosition);
      input.focus();
    }, []);

    const { isListening, isSupported, toggleListening } = useVoiceInput({
      onResult: handleVoiceResult,
    });

    // Combina refs (externo do forwardRef + interno)
    const setRefs = useCallback(
      (element: HTMLInputElement | null) => {
        internalRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref]
    );

    const showVoiceButton = voiceEnabled && isSupported;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
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
        <div className="relative flex items-center">
          <input
            ref={setRefs}
            id={inputId}
            className={`
              input-chaos
              ${showVoiceButton ? 'pr-12' : ''}
              ${error ? 'border-[var(--neon-orange)]! shadow-[0_0_10px_var(--neon-orange-glow)]' : ''}
              ${className}
            `}
            {...props}
          />
          {showVoiceButton && (
            <motion.button
              type="button"
              onClick={toggleListening}
              className={`
                absolute right-2 p-2 rounded-lg transition-colors
                ${isListening
                  ? 'text-[var(--neon-pink)] bg-[var(--neon-pink)]/10'
                  : 'text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:bg-[var(--neon-green)]/10'
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={isListening ? 'Parar gravação' : 'Gravar voz'}
              aria-label={isListening ? 'Parar gravação de voz' : 'Iniciar gravação de voz'}
            >
              {isListening ? (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </motion.svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              )}
            </motion.button>
          )}
        </div>
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

Input.displayName = 'Input';
