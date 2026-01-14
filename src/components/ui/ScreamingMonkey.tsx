'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScreamingMonkeyProps {
  isVisible: boolean;
  onComplete?: () => void;
  message?: string;
}

export function ScreamingMonkey({
  isVisible,
  onComplete,
  message = 'AAAAAHHHHH!!!',
}: ScreamingMonkeyProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      // Auto-hide after animation
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
        >
          {/* Background flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0, 0.2, 0],
              backgroundColor: ['var(--neon-pink)', 'var(--neon-yellow)', 'var(--neon-green)', 'var(--neon-pink)']
            }}
            transition={{ duration: 2, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="absolute inset-0"
          />

          {/* Monkey Container */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.5, 1.2, 1.3, 0],
              rotate: [-180, 0, -10, 10, 0],
            }}
            transition={{
              duration: 2.5,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: "easeOut"
            }}
            className="relative"
          >
            {/* Shockwave rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{
                  scale: [0.5, 3],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: 1,
                }}
                className="absolute inset-0 border-4 border-[var(--neon-yellow)] rounded-full"
                style={{
                  width: '200px',
                  height: '200px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Monkey */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1, 1.1, 1],
                rotate: [-5, 5, -5, 5, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: 6,
              }}
              className="text-[150px] leading-none filter drop-shadow-[0_0_30px_var(--neon-yellow)]"
            >
              🙈
            </motion.div>

            {/* Scream text */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 1, 0],
                y: [20, -30, -40, -50, -100],
                scale: [0, 1.2, 1, 1.1, 0.5],
              }}
              transition={{ duration: 2.5, times: [0, 0.2, 0.5, 0.8, 1] }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span
                className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--neon-yellow)] glitch"
                style={{
                  textShadow: '0 0 20px var(--neon-yellow), 0 0 40px var(--neon-yellow), 0 0 60px var(--neon-yellow)',
                }}
              >
                {message}
              </span>
            </motion.div>

            {/* Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 200,
                  y: Math.sin(i * 30 * Math.PI / 180) * 200,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="absolute left-1/2 top-1/2 text-3xl"
                style={{
                  marginLeft: '-15px',
                  marginTop: '-15px',
                }}
              >
                {['🍺', '🍻', '🥃', '🍷', '💀', '🔥', '⚡', '💥', '🎉', '🐒', '🦧', '🙊'][i]}
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom message */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: [0, 1, 1, 0], y: [50, 0, 0, -20] }}
            transition={{ duration: 2.5, times: [0, 0.3, 0.8, 1] }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <span className="font-[var(--font-accent)] text-2xl text-[var(--neon-green)] text-drunk">
              Mamaco aprovado!
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
