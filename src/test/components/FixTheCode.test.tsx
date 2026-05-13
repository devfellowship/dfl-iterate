/// <reference types="vitest" />
/// <reference types="react" />
import { render, screen, fireEvent } from '@testing-library/react';
import { FixTheCode } from '@/components/activity';
import { Activity } from '@/types';
import { ActivityType, ActivityStatus } from '@/enums';

const dummyActivity: Activity = {
  id: 'test-fix',
  lessonId: 'test',
  order: 1,
  type: ActivityType.FIX_THE_CODE,
  title: 'Dummy fix 01',
  objective: '',
  instructions: 'Fix the problem',
  targetFiles: ['file.ts'],
  status: ActivityStatus.CURRENT,
  aiGeneratedCode: `const a = 1;`,
};

describe('FixTheCode component', () => {
  it.skip('renders editor and submit', () => {
    render(
      <FixTheCode
        activity={dummyActivity}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByText(/Dummy fix/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeEnabled();
  });

  it.skip('calls onSubmit with editor contents', () => {
    const onSubmit = vi.fn();
    render(
      <FixTheCode
        activity={dummyActivity}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.stringContaining('const a = 1'));
  });
});
