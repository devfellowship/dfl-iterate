// @ts-nocheck
/// <reference types="vitest" />
/// <reference types="react" />
import { render, screen, fireEvent } from '@testing-library/react';
import { FixTheCode } from '@/components/activity';
import { Activity, TestResult } from '@/types';
import { ActivityType, ActivityStatus } from '@/enums';

const dummyActivity: Activity = {
  id: 'test-fix',
  lessonId: 'test',
  order: 1,
  type: ActivityType.FIX_THE_CODE,
  title: 'Dummy fix',
  objective: '',
  instructions: 'Fix the problem',
  targetFiles: ['file.ts'],
  status: ActivityStatus.CURRENT,
  aiGeneratedCode: `const a = 1;`,
  testCases: [
    { description: 'always pass', input: '', expectedOutput: 'a' },
  ],
};

describe('FixTheCode component', () => {
  it('renders editor and buttons', () => {
    render(
      <FixTheCode
        activity={dummyActivity}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByText('Dummy fix')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run Tests/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeEnabled();
  });

  it('runs default tests and shows results', async () => {
    render(
      <FixTheCode
        activity={dummyActivity}
        onSubmit={() => {}}
      />
    );

    const runButton = screen.getByRole('button', { name: /Run Tests/i });
    fireEvent.click(runButton);

    // wait for result
    const passed = await screen.findByText('always pass');
    expect(passed).toBeInTheDocument();
  });
});
