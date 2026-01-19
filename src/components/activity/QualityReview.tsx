import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Check, RefreshCw, Edit3, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Instructions - More prominent */}
      <motion.div 
        className="p-5 rounded-xl bg-primary/5 border-2 border-primary/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold mb-3 text-foreground">📋 Instruções</h3>
        <p className="text-base text-muted-foreground leading-relaxed">
          Revise o código gerado pela IA. Identifique problemas de acessibilidade, 
          performance e boas práticas. Decida: aprovar, editar ou pedir nova geração.
        </p>
      </motion.div>

      {/* Code Editor - Larger */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono font-semibold text-muted-foreground">
            {activity.targetFiles[0]}
          </span>
          {isEditing && (
            <span className="text-sm font-medium text-primary">✏️ Modo de edição ativo</span>
          )}
        </div>
        <CodeEditor
          value={code}
          onChange={setCode}
          language="typescript"
          readOnly={!isEditing}
          height="320px"
          fontSize={15}
        />
      </motion.div>

      {/* Issues Warning */}
      {showWarning && activity.expectedIssues && (
        <motion.div 
          className="p-5 rounded-xl bg-warning/10 border-2 border-warning/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-warning mb-2 text-lg">Problemas identificados:</h4>
              <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground">
                {activity.expectedIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions - Game Buttons */}
      <motion.div 
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isEditing ? (
          <>
            <Button onClick={handleSaveEdit} className="game-button">
              <Check className="w-5 h-5" />
              Salvar Edições
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="game-button-outline">
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleApprove} className="game-button">
              <Check className="w-5 h-5" />
              Aprovar Código
            </Button>
            <Button onClick={handleEdit} className="game-button-outline">
              <Edit3 className="w-5 h-5" />
              Editar Manualmente
            </Button>
            <Button onClick={onRegenerate} variant="ghost" className="game-button-ghost">
              <RefreshCw className="w-5 h-5" />
              Nova Geração
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
