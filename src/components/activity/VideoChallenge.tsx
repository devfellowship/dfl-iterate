import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, ExternalLink } from 'lucide-react';
import { Activity } from '@/types';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game/GameButton';
import { CodeEditor } from '@/components/editor';
import { VideoModal } from './VideoModal';
import { ActivityType } from '@/enums';

interface VideoChallengeProps {
  activity: Activity;
  onComplete: (code: string) => void;
}

export function VideoChallenge({ activity, onComplete }: VideoChallengeProps) {
  const [watched, setWatched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState(activity.aiGeneratedCode || '');

  const videoConfig = activity.videoConfig;
  
  if (!videoConfig) {
    return <div>Video configuration missing</div>;
  }

  const handleVideoClose = () => {
    setIsModalOpen(false);
    setWatched(true);
  };

  const thumbnailUrl = videoConfig.thumbnailUrl || 
    `https://img.youtube.com/vi/${videoConfig.youtubeId}/maxresdefault.jpg`;

  return (
    <ActivityGameCard
      type={ActivityType.VIDEO_CHALLENGE}
      title={activity.title}
      question="Aplique o que você aprendeu no vídeo"
      actions={
        <GameButton
          variant="primary"
          onClick={() => onComplete(code)}
          disabled={!watched}
        >
          ✓ APLICAR
        </GameButton>
      }
    >
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Video Wrapper - Chrome style like preview */}
        <div className="shrink-0 bg-card border border-border rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">📹 {videoConfig.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{videoConfig.duration}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* Video Thumbnail */}
          <motion.div
            className="relative aspect-video cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <img
              src={thumbnailUrl}
              alt={videoConfig.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Play Button - Fixed and centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
                style={{ boxShadow: '0 8px 40px rgba(243, 147, 37, 0.5)' }}
              >
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </motion.div>
            </div>
            
            {/* Watched overlay */}
            {watched && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-success font-bold">
                  <Check className="w-6 h-6" />
                  <span>Assistido</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        <p className="text-sm text-muted-foreground shrink-0">
          {watched 
            ? '✅ Vídeo assistido! Agora implemente o mesmo pattern no código abaixo.' 
            : 'Clique no vídeo para assistir, depois implemente o código.'}
        </p>

        {/* Code Editor */}
        <div className={`flex-1 min-h-0 rounded-xl overflow-hidden border border-border transition-opacity ${
          watched ? 'opacity-100' : 'opacity-50 pointer-events-none'
        }`}>
          <CodeEditor
            value={code}
            onChange={(v) => setCode(v || '')}
            language="typescript"
            fontSize={14}
          />
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        videoId={videoConfig.youtubeId}
        title={videoConfig.title}
        onClose={handleVideoClose}
      />
    </ActivityGameCard>
  );
}
