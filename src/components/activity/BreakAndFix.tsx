import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game';
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
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question="Encontre e corrija o bug no código"
      actions={
        <>
          <GameButton 
            onClick={handleTest} 
            disabled={isTesting}
            variant="primary"
            icon={<Play className="w-5 h-5" />}
          >
            {isTesting ? 'Testando...' : 'Testar'}
          </GameButton>
          <GameButton onClick={onRequestHint} variant="tertiary" icon={<Lightbulb className="w-5 h-5" />}>
            Dica
          </GameButton>
        </>
      }
    >
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Error Console - Compact */}
        <motion.div 
          className="terminal shrink-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2 text-destructive">
            <Terminal className="w-4 h-4" />
            <span className="font-bold text-sm">Error</span>
          </div>
          <div className="font-mono text-xs text-destructive/80 whitespace-pre-wrap">
            {errorMessage}
          </div>
        </motion.div>

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
            fontSize={14}
          />
        </div>

        {/* Test Result */}
        {testResult !== 'pending' && (
          <motion.div 
            className={`p-3 rounded-xl text-center font-bold shrink-0 ${
              testResult === 'success' 
                ? 'bg-success/10 border-2 border-success/30 text-success' 
                : 'bg-destructive/10 border-2 border-destructive/30 text-destructive'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {testResult === 'success' 
              ? '✅ Projeto funcionando!'
              : '❌ Ainda quebrado. Tente novamente.'}
          </motion.div>
        )}
      </div>
    </ActivityGameCard>
  );
}
