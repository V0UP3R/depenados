'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

const SECRET_PHRASE = 'na capoeira';
const HINT_START = 'vou levar minha avó...';

export const ConfirmationModal = memo(function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirmação de Mamaco',
  description = 'Para provar que você é um Depenado de verdade, complete a frase:',
}: ConfirmationModalProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleConfirm = () => {
    if (input.toLowerCase().trim() === SECRET_PHRASE) {
      setInput('');
      setError(false);
      onConfirm();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleCancel = () => {
    setInput('');
    setError(false);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-[var(--void-black)]/90 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md"
          >
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="bg-[var(--surface-card)] border-2 border-[var(--neon-yellow)] p-8 shadow-[0_0_40px_var(--neon-yellow-glow)]"
            >
              {/* Monkey Icon */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: 2 }}
                  className="inline-block text-6xl"
                  style={{ willChange: 'transform' }}
                >
                  🐒
                </motion.div>
              </div>

              {/* Title */}
              <h2 className="font-[var(--font-display)] text-2xl text-[var(--neon-yellow)] text-center mb-4">
                {title}
              </h2>

              {/* Description */}
              <p className="text-[var(--text-secondary)] font-[var(--font-body)] text-center mb-6">
                {description}
              </p>

              {/* Hint */}
              <div className="bg-[var(--surface-elevated)] p-4 mb-6 border-l-4 border-[var(--neon-pink)]">
                <p className="font-[var(--font-accent)] text-lg text-[var(--neon-pink)] text-drunk">
                  "{HINT_START}"
                </p>
              </div>

              {/* Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(false);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Complete a frase..."
                className={`
                  input-chaos w-full mb-4
                  ${error ? 'border-[var(--neon-orange)] shadow-[0_0_10px_var(--neon-orange-glow)]' : ''}
                `}
                autoFocus
              />

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[var(--neon-orange)] font-[var(--font-body)] text-sm text-center mb-4"
                >
                  Errou feio, errou rude! Tenta de novo, mamaco.
                </motion.p>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="neon"
                  onClick={handleConfirm}
                  className="flex-1"
                  glitch
                >
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
