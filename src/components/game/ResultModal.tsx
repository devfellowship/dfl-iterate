import { motion, AnimatePresence } from 'framer-motion';
import { GameButton } from './GameButton';

interface ResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  xpEarned?: number;
  activityTitle: string;
  aiFeedback: string;
  onContinue: () => void;
  isLessonComplete?: boolean;
}

export function ResultModal({
  isOpen,
  isSuccess,
  xpEarned = 25,
  activityTitle,
  aiFeedback,
  onContinue,
  isLessonComplete = false,
}: ResultModalProps) {
  // Parse markdown-like syntax
  const renderFeedback = (content: string) => {
    const lines = content.split('\n');
    
    return lines.map((line, i) => {
      // Handle bold text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
        }
        // Handle inline code
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, k) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return (
              <code key={k} className="px-1.5 py-0.5 rounded bg-muted text-primary text-xs font-mono">
                {cp.slice(1, -1)}
              </code>
            );
          }
          return cp;
        });
      });
      
      // Handle bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.match(/^\d+\./)) {
        return (
          <div key={i} className="flex gap-2 ml-2">
            <span className="text-muted-foreground">{line.trim().charAt(0) === '•' || line.trim().charAt(0) === '-' ? '•' : line.match(/^\d+\./)?.[0]}</span>
            <span>{rendered}</span>
          </div>
        );
      }
      
      return <div key={i}>{rendered}</div>;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Emoji */}
            <motion.div
              className="text-6xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }}
            >
              {isSuccess ? '🎉' : '😅'}
            </motion.div>

            {/* XP Badge (success only) */}
            {isSuccess && xpEarned && (
              <motion.div
                className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-xp to-amber-500 text-black font-extrabold text-xl mb-4"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', damping: 12 }}
              >
                +{xpEarned} XP
              </motion.div>
            )}

            {/* Title */}
            <motion.h2
              className="font-display font-bold text-2xl text-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isSuccess 
                ? isLessonComplete 
                  ? '🎓 Lesson Completa!' 
                  : `${activityTitle} Completa!`
                : 'Quase lá!'}
            </motion.h2>

            {/* AI Feedback Card */}
            <motion.div
              className="bg-background/80 border border-border rounded-2xl p-5 text-left mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3 text-muted-foreground text-sm font-semibold">
                <span className="text-lg">🤖</span>
                <span>AI Assistant</span>
              </div>
              <div className="text-sm text-foreground/90 leading-relaxed space-y-1">
                {renderFeedback(aiFeedback)}
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GameButton
                variant={isSuccess ? 'primary' : 'secondary'}
                onClick={onContinue}
                className="w-full"
              >
                {isSuccess 
                  ? isLessonComplete 
                    ? 'Voltar ao Início 🏠' 
                    : 'Próxima Activity →' 
                  : 'Tentar Novamente'}
              </GameButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
