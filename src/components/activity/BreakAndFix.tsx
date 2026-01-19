import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { AlertTriangle, Play, Terminal, Lightbulb } from 'lucide-react';

interface BreakAndFixProps {
  activity: Activity;
  errorMessage: string;
  onFix: (code: string) => void;
  onRequestHint: () => void;
}

export function BreakAndFix({ activity, errorMessage, onFix, onRequestHint }: BreakAndFixProps) {
  const [code, setCode] = useState(activity.aiGeneratedCode || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'pending' | 'success' | 'error'>('pending');

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult('pending');
    
    // Simulate testing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if the fix is correct (simplified check)
    const hasOptionalChaining = code.includes('?.') || code.includes('|| []') || code.includes('?? []');
    
    if (hasOptionalChaining) {
      setTestResult('success');
      setTimeout(() => {
        onFix(code);
      }, 500);
    } else {
      setTestResult('error');
    }
    
    setIsTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <motion.div 
        className="p-4 rounded-lg bg-destructive/10 border border-destructive/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
          <div>
            <h3 className="font-bold text-destructive text-lg">⚠️ PROJETO QUEBRADO</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {activity.instructions.split('\n')[0]}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error Console */}
      <motion.div 
        className="terminal"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3 text-destructive">
          <Terminal className="w-4 h-4" />
          <span className="font-semibold text-sm">Console</span>
        </div>
        <div className="font-mono text-sm text-destructive whitespace-pre-wrap">
          {errorMessage}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="p-4 rounded-lg bg-muted/30 border border-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold mb-2 text-foreground">Sua Missão</h3>
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
          {activity.instructions.split('\n').slice(3).join('\n')}
        </pre>
      </motion.div>

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {activity.targetFiles[0]}
          </span>
        </div>
        <CodeEditor
          value={code}
          onChange={setCode}
          language="typescript"
          height="350px"
        />
      </motion.div>

      {/* Test Result */}
      {testResult !== 'pending' && (
        <motion.div 
          className={`p-3 rounded-lg ${
            testResult === 'success' 
              ? 'bg-success/10 border border-success/30 text-success' 
              : 'bg-destructive/10 border border-destructive/30 text-destructive'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {testResult === 'success' 
            ? '✅ Correção aplicada com sucesso! Projeto funcionando novamente.'
            : '❌ O erro persiste. Verifique sua correção e tente novamente.'}
        </motion.div>
      )}

      {/* Actions */}
      <motion.div 
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          onClick={handleTest} 
          disabled={isTesting}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          {isTesting ? 'Testando...' : 'Testar Correção'}
        </Button>
        <Button onClick={onRequestHint} variant="outline" className="gap-2">
          <Lightbulb className="w-4 h-4" />
          Pedir Dica
        </Button>
      </motion.div>
    </div>
  );
}
