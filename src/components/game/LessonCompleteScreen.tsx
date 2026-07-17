import { motion } from 'framer-motion';
import { ExternalLink, Copy, Check, Github } from 'lucide-react';
import { useState } from 'react';
import { GameButton } from './GameButton';
import { Decision } from '@/types';

interface LessonCompleteScreenProps {
  lessonTitle: string;
  stats: {
    xpEarned: number;
    livesRemaining: number;
    streak: number;
    timeMinutes: number;
  };
  decisions: Decision[];
  githubRepo: string;
  onGoHome: () => void;
  onShare?: () => void;
}

export function LessonCompleteScreen({
  lessonTitle,
  stats,
  decisions,
  githubRepo,
  onGoHome,
  onShare,
}: LessonCompleteScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${githubRepo}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenRepo = () => {
    window.open(`https://${githubRepo}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Celebration Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 10 }}
        >
          <span className="text-7xl">🎉</span>
        </motion.div>

        <motion.h1 
          className="font-display text-4xl font-black text-center text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          LESSON COMPLETE!
        </motion.h1>
        
        <motion.p 
          className="text-center text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Você completou <span className="text-primary font-semibold">{lessonTitle}</span>
        </motion.p>

        {/* Preview Mini */}
        <motion.div 
          className="mb-8 p-1 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-card rounded-xl p-6 text-center">
            <span className="text-4xl mb-2 block">🥊</span>
            <h3 className="font-bold text-lg text-foreground">BoxShop</h3>
            <p className="text-sm text-muted-foreground">E-commerce Frontend Completo</p>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          className="bg-card border border-border rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <span>📊</span> Seu Progresso
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-background rounded-xl p-4 text-center">
              <span className="text-2xl">⚡</span>
              <p className="text-2xl font-black text-xp">{stats.xpEarned} XP</p>
              <p className="text-xs text-muted-foreground">ganhos</p>
            </div>
            <div className="bg-background rounded-xl p-4 text-center">
              <span className="text-2xl">❤️</span>
              <p className="text-2xl font-black text-life">{stats.livesRemaining}</p>
              <p className="text-xs text-muted-foreground">vidas restantes</p>
            </div>
            <div className="bg-background rounded-xl p-4 text-center">
              <span className="text-2xl">🔥</span>
              <p className="text-2xl font-black text-streak">{stats.streak} dias</p>
              <p className="text-xs text-muted-foreground">streak</p>
            </div>
            <div className="bg-background rounded-xl p-4 text-center">
              <span className="text-2xl">⏱️</span>
              <p className="text-2xl font-black text-foreground">{stats.timeMinutes} min</p>
              <p className="text-xs text-muted-foreground">tempo total</p>
            </div>
          </div>

          {/* Decisions Summary */}
          {decisions.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <span>📝</span> Decisões tomadas
              </h4>
              <div className="space-y-2">
                {decisions.map((decision, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="text-success">✓</span>
                    <span>{decision.activityTitle}: {decision.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* GitHub Card */}
        <motion.div 
          className="rounded-2xl p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
            border: '1px solid #30363d',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-6 h-6 text-white" />
            <h3 className="font-bold text-lg text-white">Seu código está no GitHub!</h3>
          </div>
          
          <p className="font-mono text-sm text-[#58a6ff] mb-4">
            {githubRepo}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleOpenRepo}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Repositório
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 bg-transparent border border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9] font-semibold rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Link
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <GameButton
            variant="primary"
            onClick={onGoHome}
            className="flex-1"
          >
            🏠 Voltar ao Início
          </GameButton>
          {onShare && (
            <GameButton
              variant="secondary"
              onClick={onShare}
              className="flex-1"
            >
              📤 Compartilhar
            </GameButton>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
