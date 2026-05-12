import { useState, useRef, useCallback, useEffect } from 'react';
import { Activity } from '@/types';
import { ActivityType } from '@/enums';

interface TerminalCommand {
  command: string;
  description: string;
  output?: string;
  validation?: 'exact' | 'contains' | 'regex';
}

interface REPLChallengeActivity extends Activity {
  type: typeof ActivityType.REPL_CHALLENGE;
  commands: TerminalCommand[];
  initialPrompt?: string;
}

export type LineType = 'prompt' | 'output' | 'error' | 'success' | 'info';

export interface TerminalLine {
  id: string;
  type: LineType;
  content: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function validateCommand(input: string, expected: TerminalCommand): boolean {
  const mode = expected.validation ?? 'exact';
  const trimmed = input.trim();

  if (mode === 'exact') return trimmed === expected.command;
  if (mode === 'contains') return trimmed.includes(expected.command);
  if (mode === 'regex') {
    try {
      return new RegExp(expected.command).test(trimmed);
    } catch {
      return false;
    }
  }
  return false;
}

export function useREPLChallenge(activity: Activity, onSubmit: (commands: string[]) => void) {
  const act = activity as REPLChallengeActivity;
  const commands = act.commands ?? [];
  const prompt = act.initialPrompt ?? '$ ';

  const [lines, setLines] = useState<TerminalLine[]>([
    { id: uid(), type: 'info', content: '─── Bem-vindo ao terminal de prática ───' },
    { id: uid(), type: 'info', content: 'Siga as instruções e execute os comandos corretos.' },
    { id: uid(), type: 'info', content: '' },
  ]);

  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [completedCommands, setCompletedCommands] = useState<string[]>([]);
  const [stepStatus, setStepStatus] = useState<('idle' | 'success' | 'error')[]>(
    () => commands.map(() => 'idle')
  );
  const [done, setDone] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const focusInput = useCallback(() => {
    if (!done) inputRef.current?.focus();
  }, [done]);

  const addLine = useCallback((type: LineType, content: string) => {
    setLines(prev => [...prev, { id: uid(), type, content }]);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || done) return;

    const trimmed = input.trim();

    addLine('prompt', `${prompt}${trimmed}`);
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);
    setInput('');

    if (currentStep >= commands.length) return;

    const expected = commands[currentStep];
    const isValid = validateCommand(trimmed, expected);

    if (isValid) {
      if (expected.output) {
        expected.output.split('\n').forEach(line => addLine('output', line));
      }
      addLine('success', '✓ Correto!');

      const newCompleted = [...completedCommands, trimmed];
      setCompletedCommands(newCompleted);

      setStepStatus(prev => {
        const next = [...prev];
        next[currentStep] = 'success';
        return next;
      });

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep >= commands.length) {
        addLine('info', '');
        addLine('success', '🎉 Todos os comandos executados com sucesso!');
        setDone(true);
        setTimeout(() => onSubmit(newCompleted), 800);
      } else {
        addLine('info', '');
      }
    } else {
      addLine('error', '✗ Comando incorreto. Tente novamente.');
      addLine('info', `  Dica: verifique a sintaxe de "${expected.command}"`);

      setStepStatus(prev => {
        const next = [...prev];
        next[currentStep] = 'error';
        return next;
      });

      setTimeout(() => {
        setStepStatus(prev => {
          const next = [...prev];
          next[currentStep] = 'idle';
          return next;
        });
      }, 1200);
    }
  }, [input, done, currentStep, commands, completedCommands, addLine, onSubmit, prompt]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < history.length) {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  }, [handleSubmit, historyIndex, history]);

  const handleReset = useCallback(() => {
    setLines([
      { id: uid(), type: 'info', content: '─── Terminal reiniciado ───' },
      { id: uid(), type: 'info', content: '' },
    ]);
    setInput('');
    setCurrentStep(0);
    setCompletedCommands([]);
    setStepStatus(commands.map(() => 'idle'));
    setDone(false);
    setHistory([]);
    setHistoryIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [commands]);

  return {
    lines,
    input,
    setInput,
    currentStep,
    stepStatus,
    completedCommands,
    done,
    commands,
    prompt,
    inputRef,
    scrollRef,
    focusInput,
    handleSubmit,
    handleKeyDown,
    handleReset,
  };
}