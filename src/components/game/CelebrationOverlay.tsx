import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { GameButton } from './GameButton';

interface CelebrationOverlayProps {
  isVisible: boolean;
  xpEarned: number;
  message: string;
  onContinue: () => void;
}

export function CelebrationOverlay({ isVisible, xpEarned, message, onContinue }: CelebrationOverlayProps) {
  // Play celebration sound effect (optional)
  useEffect(() => {
    if (isVisible) {
      // Could add sound here
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ['#f39325', '#22c55e', '#fbbf24', '#ef4444', '#3b82f6'][i % 5],
                }}
                initial={{ y: -20, opacity: 1, scale: 1 }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Celebration Card */}
          <motion.div
            className="relative bg-card border-2 border-primary/30 rounded-3xl p-8 max-w-md mx-4 text-center"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            {/* Sparkle decoration */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-xp" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="font-display text-3xl font-black text-foreground mb-2 mt-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              INCRÍVEL!
            </motion.h2>

            {/* Message */}
            <p className="text-muted-foreground text-lg mb-6">
              {message}
            </p>

            {/* XP Earned */}
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-xp/20 border border-xp/30 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Zap className="w-6 h-6 text-xp" />
              <span className="font-display text-2xl font-black text-xp">+{xpEarned} XP</span>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GameButton onClick={onContinue} variant="primary">
                Continuar
                <ArrowRight className="w-5 h-5" />
              </GameButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
