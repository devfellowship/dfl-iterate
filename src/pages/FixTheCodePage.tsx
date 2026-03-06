import { useState } from 'react';
import { ActivityType, ActivityStatus } from '@/enums';
import { Activity, TestResult } from '@/types';
import { FixTheCode } from '@/components/activity';

const sampleActivity: Activity = {
  id: 'fix-code-sample',
  lessonId: 'demo',
  order: 1,
  type: ActivityType.FIX_THE_CODE,
  title: 'Corrija o FizzBuzz',
  objective: '',
  instructions: `A função deveria retornar strings corretas para FizzBuzz. O código atual não cobre todos os casos.`,
  targetFiles: ['src/utils/fizzbuzz.ts'],
  status: ActivityStatus.CURRENT,
  aiGeneratedCode: `export function fizzbuzz(n: number): string {
  let result = '';
  if (n % 3 === 0) result += 'Fizz';
  if (n % 5 === 0) result += 'Buzz';
  return result;
}`,
  testCases: [
    { description: 'n=3 retorna Fizz', input: '3', expectedOutput: 'Fizz' },
    { description: 'n=5 retorna Buzz', input: '5', expectedOutput: 'Buzz' },
    { description: 'n=15 retorna FizzBuzz', input: '15', expectedOutput: 'FizzBuzz' },
  ],
};

export default function FixTheCodePage() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = (code: string) => {
    setSubmitted(code);
  };

  const runTests = async (code: string): Promise<TestResult[]> => {
    return sampleActivity.testCases!.map(tc => ({
      description: tc.description,
      passed: code.includes(tc.expectedOutput),
    }));
  };

  return (
    <div className="h-screen p-8 bg-background">
      <FixTheCode
        activity={sampleActivity}
        onSubmit={handleSubmit}
        onRunTests={runTests}
      />

      {submitted && (
        <div className="mt-4 p-4 bg-card rounded">
          <h2 className="font-bold">Código submetido</h2>
          <pre className="text-sm font-mono whitespace-pre-wrap">{submitted}</pre>
        </div>
      )}
    </div>
  );
}
