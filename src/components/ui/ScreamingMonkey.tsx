'use client';

import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScreamingMonkeyProps {
  isVisible: boolean;
  onComplete?: () => void;
  message?: string;
}

// Emojis pré-definidos para evitar recálculo
const PARTICLE_EMOJIS = ['🍺', '🍻', '🥃', '💀', '🔥', '🐒'];
const PARTICLE_ANGLES = [0, 60, 120, 180, 240, 300];

export const ScreamingMonkey = memo(function ScreamingMonkey({
  isVisible,
  onComplete,
  message = 'AAAAAHHHHH!!!',
}: ScreamingMonkeyProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 2200);
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
          {/* Background flash - simplificado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-[var(--neon-yellow)]"
          />

          {/* Monkey Container */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.3, 1], rotate: [-180, 0, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Shockwave rings - reduzido para 2 */}
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1, delay: i * 0.15 }}
                className="absolute border-4 border-[var(--neon-yellow)] rounded-full"
                style={{
                  width: '180px',
                  height: '180px',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-90px',
                  marginTop: '-90px',
                  willChange: 'transform, opacity',
                }}
              />
            ))}

            {/* Monkey - animação CSS mais leve */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.2, repeat: 4 }}
              className="text-[140px] leading-none"
              style={{
                filter: 'drop-shadow(0 0 25px var(--neon-yellow))',
                willChange: 'transform',
              }}
            >
              🙈
            </motion.div>

            {/* Scream text - simplificado */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, -40, -60, -80], scale: [0.5, 1.1, 1, 0.8] }}
              transition={{ duration: 2, times: [0, 0.2, 0.7, 1] }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span
                className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--neon-yellow)]"
                style={{ textShadow: '0 0 20px var(--neon-yellow), 0 0 40px var(--neon-yellow)' }}
              >
                {message}
              </span>
            </motion.div>

            {/* Particles - reduzido para 6 */}
            {PARTICLE_ANGLES.map((angle, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle * Math.PI / 180) * 150,
                  y: Math.sin(angle * Math.PI / 180) * 150,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 text-2xl"
                style={{ marginLeft: '-12px', marginTop: '-12px', willChange: 'transform, opacity' }}
              >
                {PARTICLE_EMOJIS[i]}
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -10] }}
            transition={{ duration: 2, times: [0, 0.3, 0.8, 1] }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <span className="font-[var(--font-accent)] text-xl text-[var(--neon-green)]">
              Mamaco aprovado!
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
