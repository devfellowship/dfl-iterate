import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Check, Info } from 'lucide-react';
import { initialProjectFiles } from '@/test-utils/project.dummy';

interface ConstrainedEditProps {
  activity: Activity;
  onSubmit: (code: string) => void;
}

export function ConstrainedEdit({ activity, onSubmit }: ConstrainedEditProps) {
  const initialCode = useMemo(() => {
    const file = initialProjectFiles.find(f => f.path === activity.targetFiles[0]);
    return file?.content || '';
  }, [activity.targetFiles]);

  const [code, setCode] = useState(initialCode);

  const handleSubmit = () => {
    onSubmit(code);
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

      {/* Editable Regions Info */}
      {activity.editableRegions && (
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {activity.editableRegions.map((region, i) => (
            <div 
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm"
            >
              <Info className="w-3.5 h-3.5 text-primary" />
              <span className="text-foreground">
                Linhas {region.startLine}-{region.endLine}
              </span>
              {region.hint && (
                <span className="text-muted-foreground">• {region.hint}</span>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {activity.targetFiles[0]}
          </span>
          <span className="text-xs text-primary">
            Apenas as regiões destacadas são editáveis
          </span>
        </div>
        <CodeEditor
          value={code}
          onChange={setCode}
          language="typescript"
          height="400px"
          highlightLines={activity.editableRegions?.flatMap(r => 
            Array.from({ length: r.endLine - r.startLine + 1 }, (_, i) => r.startLine + i)
          )}
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button onClick={handleSubmit} className="gap-2">
          <Check className="w-4 h-4" />
          Aplicar Mudanças
        </Button>
      </motion.div>
    </div>
  );
}
