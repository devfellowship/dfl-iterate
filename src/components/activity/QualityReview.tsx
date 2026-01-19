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
      {/* Instructions */}
      <motion.div 
        className="p-4 rounded-lg bg-muted/30 border border-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-2 text-foreground">Instruções</h3>
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
          {activity.instructions}
        </pre>
      </motion.div>

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {activity.targetFiles[0]}
          </span>
          {isEditing && (
            <span className="text-xs text-primary">Modo de edição ativo</span>
          )}
        </div>
        <CodeEditor
          value={code}
          onChange={setCode}
          language="typescript"
          readOnly={!isEditing}
          height="300px"
        />
      </motion.div>

      {/* Issues Warning */}
      {showWarning && activity.expectedIssues && (
        <motion.div 
          className="p-4 rounded-lg bg-warning/10 border border-warning/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-warning mb-2">Problemas identificados:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {activity.expectedIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div 
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isEditing ? (
          <>
            <Button onClick={handleSaveEdit} className="gap-2">
              <Check className="w-4 h-4" />
              Salvar Edições
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleApprove} variant="default" className="gap-2">
              <Check className="w-4 h-4" />
              Aprovar Código
            </Button>
            <Button onClick={handleEdit} variant="outline" className="gap-2">
              <Edit3 className="w-4 h-4" />
              Editar Manualmente
            </Button>
            <Button onClick={onRegenerate} variant="ghost" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Pedir Nova Geração
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
