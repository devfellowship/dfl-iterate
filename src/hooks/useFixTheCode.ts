import { useCallback, useState } from 'react';
import { Activity, TestResult } from '@/types';

export function useFixTheCode(
  activity: Activity,
  onSubmit: (fixedCode: string) => void,
  onRunTests?: (code: string) => Promise<TestResult[]>
) {
  const [code, setCode] = useState(activity.aiGeneratedCode || '');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = useCallback(async () => {
    setIsRunning(true);
    let res: TestResult[] = [];

    if (onRunTests) {
      try {
        res = await onRunTests(code);
      } catch {
        res = [];
      }
    } else {
      res =
        activity.testCases?.map(tc => ({
          description: tc.description,
          passed: code.includes(tc.expectedOutput),
        })) || [];

      // Simulate delay to give feedback when running tests
      await new Promise(r => setTimeout(r, 500));
    }

    setResults(res);
    setIsRunning(false);
  }, [activity.testCases, code, onRunTests]);

  const handleSubmit = useCallback(() => {
    onSubmit(code);
  }, [code, onSubmit]);

  return {
    code,
    setCode,
    results,
    isRunning,
    runTests,
    handleSubmit,
  };
}
