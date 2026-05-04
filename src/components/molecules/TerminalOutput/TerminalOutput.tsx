import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalLine, LineType } from '@/hooks/useREPLChallenge';

interface TerminalOutputProps {
  lines: TerminalLine[];
  done: boolean;
  prompt: string;
  input: string;
  inputRef: React.RefObject<HTMLInputElement>;
  scrollRef: React.RefObject<HTMLDivElement>;
  setInput: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const lineColor: Record<LineType, string> = {
  prompt: 'text-green-400',
  output: 'text-gray-300',
  error: 'text-red-400',
  success: 'text-emerald-400',
  info: 'text-gray-500',
};

const MONO_FONT = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";

export function TerminalOutput({
  lines,
  done,
  prompt,
  input,
  inputRef,
  scrollRef,
  setInput,
  onKeyDown,
}: TerminalOutputProps) {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-6"
      style={{ fontFamily: MONO_FONT }}
    >
      <AnimatePresence initial={false}>
        {lines.map(line => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className={`${lineColor[line.type]} whitespace-pre-wrap break-all`}
          >
            {line.content || '\u00A0'}
          </motion.div>
        ))}
      </AnimatePresence>

      {!done && (
        <div className="flex items-center gap-0 text-green-400">
          <span className="shrink-0">{prompt}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full bg-transparent outline-none text-green-400 caret-green-400 font-mono"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 'inherit', lineHeight: 'inherit' }}
            />
          </div>
        </div>
      )}

      {done && (
        <div className="text-green-400 mt-1 animate-pulse">{prompt}▋</div>
      )}
    </div>
  );
}