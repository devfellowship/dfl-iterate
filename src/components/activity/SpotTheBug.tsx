import { useMemo, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { generateBugChallenge } from '@/lib/generateBugChallenge';
import { Activity } from '@/types';
import { GameButton } from '@/components/game';

type SpotTheBugProps = {
  activity: Activity;
  onSuccess: () => void;
  onError: () => void;
};

export function SpotTheBug({ activity, onSuccess, onError }: SpotTheBugProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const challenge = useMemo(() => generateBugChallenge(), [activity.id]);

  const lines = useMemo(() => challenge.code.split(/\r?\n/), [challenge]);

  const highlightedLines = useMemo(() => {
    const html = Prism.highlight(
      challenge.code,
      (Prism as any).languages.typescript ?? Prism.languages.javascript,
      'typescript'
    );
    return html.split('\n');
  }, [challenge]);

  const handleLineClick = (lineNumber: number) => setSelectedLine(lineNumber);

  const handleConfirm = () => {
    if (selectedLine === null) return;
    
    // Apenas verifica e reporta para o pai. O PAI decide como mostrar o erro.
    if (selectedLine === challenge.bugLine) {
      onSuccess();
    } else {
      onError(); 
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-[#050505] rounded-xl overflow-hidden border border-white/5 flex flex-col flex-1">
          <div className="bg-[#0b0b0b] flex items-center gap-2 px-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-4 text-xs text-zinc-500 font-medium">src/ReviewManager.tsx</div>
          </div>

          <div className="flex-1 px-6 py-6 font-mono text-[13px] leading-relaxed text-zinc-100 overflow-auto">
            <div className="space-y-1">
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                return (
                  <div
                    key={lineNumber}
                    onClick={() => handleLineClick(lineNumber)}
                    className={`w-full flex gap-6 items-baseline rounded-md px-2 py-0.5 transition-colors cursor-pointer ${
                      selectedLine === lineNumber ? 'bg-orange-500/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="w-8 text-right text-xs text-zinc-500/70 select-none">{lineNumber}</span>
                    <span className="whitespace-pre text-[13px] text-zinc-100/90" dangerouslySetInnerHTML={{ __html: highlightedLines[index] ?? line }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pb-4 shrink-0">
        <GameButton onClick={handleConfirm} variant="primary">
          Confirmar
        </GameButton>
      </div>
    </div>
  );
}