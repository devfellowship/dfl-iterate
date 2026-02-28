// @ts-nocheck
/// <reference types="react" />
import React, { useState } from 'react';
import { Play, Check, X, Bug } from 'lucide-react';
import { Activity, TestResult } from '@/types';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game';

export interface FixTheCodeProps {
  activity: Activity;
  onSubmit: (fixedCode: string) => void;
  /**
   * Optional handler that runs tests against the current code. If omitted the
   * component will try to evaluate `activity.testCases` in a very naive way.
   */
  onRunTests?: (code: string) => Promise<TestResult[]>;
}

export function FixTheCode({ activity, onSubmit, onRunTests }: FixTheCodeProps) {
  const [code, setCode] = useState(activity.aiGeneratedCode || '');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    let res: TestResult[] = [];

    if (onRunTests) {
      try {
        res = await onRunTests(code);
      } catch (err) {
        res = [];
      }
    } else {
      // fallback: basic comparison against expectedOutput string presence
      res = activity.testCases?.map(tc => ({
        description: tc.description,
        passed: code.includes(tc.expectedOutput),
      })) || [];

      // simulate a brief delay
      await new Promise((r) => setTimeout(r, 500));
    }

    setResults(res);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question="Corrija o código e valide com os testes"
      actions={
        <>
          <GameButton
            onClick={runTests}
            disabled={isRunning}
            icon={<Play className="w-5 h-5" />}
          >
            {isRunning ? 'Executando...' : 'Run Tests'}
          </GameButton>
          <GameButton onClick={handleSubmit} variant="primary">
            Submit
          </GameButton>
        </>
      }
    >
      <div className="flex-1 flex overflow-hidden">
        {/* editor + output */}
        <div className="w-[70%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="typescript"
              fontSize={14}
            />
          </div>

          {/* test results / console */}
          <div className="mt-2 overflow-auto max-h-40 bg-card/30 p-2 rounded">
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum teste executado</p>
            ) : (
              results.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {r.passed ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span>{r.description}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* instructions / console on the right */}
        <div className="w-[30%] pl-4 overflow-auto">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {activity.instructions}
          </div>
        </div>
      </div>
    </ActivityGameCard>
  );
}
