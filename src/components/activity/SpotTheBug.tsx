import { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';
import { Activity } from '@/types';
import { GameButton } from '@/components/game';
import { useSpotTheBug } from '@/hooks/useSpotTheBug';

type SpotTheBugProps = {
  activity: Activity;
  onSuccess: (fb: string) => void;
  onError: () => void;
};

export function SpotTheBug({ activity, onSuccess, onError }: SpotTheBugProps) {
  const { challenge, selectedLine, setSelectedLine, handleConfirm } = useSpotTheBug({
    activityId: activity.id,
    onSuccess,
    onError
  });

  // O Prism agora destaca o código do desafio que foi sorteado
  const highlightedLines = useMemo(() => 
    Prism.highlight(challenge.code, Prism.languages.typescript, 'typescript').split('\n'), 
  [challenge]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 overflow-hidden flex flex-col bg-[#050505] rounded-xl border border-white/5">
        <div className="bg-[#0b0b0b] flex items-center gap-2 px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-xs text-zinc-500 font-medium ml-4">src/ReviewManager.tsx</div>
        </div>

        <div className="flex-1 px-6 py-6 font-mono text-[13px] overflow-auto">
          <div className="space-y-1">
            {highlightedLines.map((line, index) => (
              <div
                key={index}
                onClick={() => setSelectedLine(index + 1)}
                className={`flex gap-6 items-baseline rounded-md px-2 py-0.5 cursor-pointer transition-colors ${
                  selectedLine === index + 1 ? 'bg-orange-500/20' : 'hover:bg-white/5'
                }`}
              >
                <span className="w-8 text-right text-xs text-zinc-500/70 select-none">{index + 1}</span>
                <span className="whitespace-pre text-zinc-100/90" dangerouslySetInnerHTML={{ __html: line }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-2">
        <GameButton onClick={handleConfirm} variant="primary">Confirmar</GameButton>
      </div>
    </div>
  );
}