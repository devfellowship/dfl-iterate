import { useState } from 'react';
import { Activity } from '@/types';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game';
import { Check, Edit3, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QualityReviewProps {
  activity: Activity;
  onApprove: () => void;
  onRegenerate: () => void;
  onEdit: (code: string) => void;
}

export function QualityReview({ activity, onApprove, onRegenerate, onEdit }: QualityReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(activity.aiGeneratedCode || '');
  const [showWarning, setShowWarning] = useState(false);

  const handleApprove = () => {
    if (activity.expectedIssues && activity.expectedIssues.length > 0) {
      setShowWarning(true);
    }
    onApprove();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEdit(code);
    setIsEditing(false);
  };

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={isEditing ? "Salve suas edições quando terminar" : "O código está pronto para produção?"}
      actions={
        isEditing ? (
          <>
            <GameButton onClick={handleSaveEdit} variant="primary" icon={<Check className="w-5 h-5" />}>
              Salvar
            </GameButton>
            <GameButton onClick={() => setIsEditing(false)} variant="tertiary">
              Cancelar
            </GameButton>
          </>
        ) : (
          <>
            <GameButton onClick={handleApprove} variant="primary" icon={<Check className="w-5 h-5" />}>
              Aprovar
            </GameButton>
            <GameButton onClick={handleEdit} variant="secondary" icon={<Edit3 className="w-5 h-5" />}>
              Editar
            </GameButton>
            <GameButton onClick={onRegenerate} variant="tertiary" icon={<RefreshCw className="w-5 h-5" />}>
              Regen
            </GameButton>
          </>
        )
      }
    >
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Code Editor - Main focus */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
            readOnly={!isEditing}
            fontSize={14}
          />
        </div>

        {/* Warning - Only if shown */}
        {showWarning && activity.expectedIssues && (
          <motion.div 
            className="p-4 rounded-xl bg-warning/10 border-2 border-warning/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-warning mb-2">Problemas identificados:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {activity.expectedIssues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </ActivityGameCard>
  );
}
