import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { Activity } from '@/types';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game/GameButton';
import { CodeEditor } from '@/components/editor';
import { ImageZoomModal } from './ImageZoomModal';
import { ActivityType } from '@/enums';

interface VisualImplementationProps {
  activity: Activity;
  onComplete: (code: string) => void;
}

export function VisualImplementation({ activity, onComplete }: VisualImplementationProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [code, setCode] = useState(activity.aiGeneratedCode || '');

  const visualConfig = activity.visualConfig;
  
  if (!visualConfig) {
    return <div>Visual configuration missing</div>;
  }

  return (
    <ActivityGameCard
      type={ActivityType.VISUAL_IMPLEMENTATION}
      title={activity.title}
      question="Aproxime seu código do design de referência"
      actions={
        <GameButton
          variant="primary"
          onClick={() => onComplete(code)}
        >
          👁️ COMPARAR
        </GameButton>
      }
    >
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Reference Image */}
        <div className="shrink-0">
          <p className="text-sm text-muted-foreground mb-2 font-semibold">Referência</p>
          <motion.div
            className="relative rounded-xl overflow-hidden cursor-zoom-in border-2 border-border group"
            onClick={() => setIsZoomed(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <img
              src={visualConfig.imageUrl}
              alt={visualConfig.caption || 'Design reference'}
              className="w-full h-auto max-h-48 object-contain bg-muted"
            />
            
            {/* Zoom Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-foreground" />
              </div>
            </div>
          </motion.div>
          
          {visualConfig.caption && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              {visualConfig.caption}
            </p>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-border">
          <CodeEditor
            value={code}
            onChange={(v) => setCode(v || '')}
            language="typescript"
            fontSize={14}
          />
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={isZoomed}
        imageUrl={visualConfig.imageUrl}
        caption={visualConfig.caption}
        onClose={() => setIsZoomed(false)}
      />
    </ActivityGameCard>
  );
}
