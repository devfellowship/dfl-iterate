import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Check } from 'lucide-react';
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
        {/* Video Thumbnail */}
        <motion.div
          className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shrink-0"
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img
            src={thumbnailUrl}
            alt={videoConfig.title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
          
          {/* Play Button */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            style={{ boxShadow: '0 8px 32px rgba(243, 147, 37, 0.4)' }}
          >
            <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
          </motion.div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-mono font-semibold text-white">
            {videoConfig.duration}
          </div>
          
          {/* Title */}
          <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
            {videoConfig.title}
          </div>
        </motion.div>

        {/* Watched Badge */}
        {watched && (
          <motion.div 
            className="flex items-center gap-2 text-success text-sm font-semibold shrink-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Check className="w-4 h-4" />
            <span>Vídeo assistido</span>
          </motion.div>
        )}

        {/* Instructions */}
        <p className="text-sm text-muted-foreground shrink-0">
          Após assistir, implemente o mesmo pattern no código.
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
