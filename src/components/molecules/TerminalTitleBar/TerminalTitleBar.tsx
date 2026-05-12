import { Terminal } from 'lucide-react';

interface TerminalTitleBarProps {
  title?: string;
}

export function TerminalTitleBar({ title = 'bash' }: TerminalTitleBarProps) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700/60"
      style={{ background: '#161b22' }}
    >
      <span className="w-3 h-3 rounded-full bg-red-500/80" />
      <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
      <span className="w-3 h-3 rounded-full bg-green-500/80" />
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Terminal className="w-3 h-3" />
          <span className="font-mono">{title}</span>
        </div>
      </div>
    </div>
  );
}