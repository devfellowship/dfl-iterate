import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ChooseOption } from '@/types';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ChooseCard } from '@/components/atoms/ChooseCard';
import { useReadAndChoose } from '@/hooks/useReadAndChoose';


interface ReadAndChooseProps {
  activity: Activity;
  onDecide: (optionId: string) => void;
}

export function ReadAndChoose({ activity, onDecide }: ReadAndChooseProps) {
  const code = activity.aiGeneratedCode || '';
  const { selectedOption, setSelectedOption, isConfirming, handleConfirm} =
  useReadAndChoose({ onDecide});

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={activity.objective || ''}
      actions={
        <GameButton 
          onClick={handleConfirm} 
          disabled={!selectedOption || isConfirming}
          variant="primary"
          icon={isConfirming ? <Sparkles className="w-5 h-5 animate-pulse" /> : undefined}
        >
          {isConfirming ? 'Aplicando...' : 'Confirmar'}
        </GameButton>
      }
    >
      <div className="flex-1 flex flex-col gap-4 pb-4 overflow-hidden">
        {/* Code Snippet (Read-only) */}
        <div className="shrink-0 rounded-xl overflow-hidden border border-border">
          <CodeEditor
            value={code}
            language="typescript"
            readOnly
            fontSize={14}
          />
        </div>

        {/* Options Grid */}
        <div className="grid gap-4 md:grid-cols-3 pb-2">
          {activity.choices?.map((choice, index) => (
            <ChooseCard
              key={choice.id}
              choice={choice}
              index={index}
              isSelected={selectedOption === choice.id}
              onSelect={() => setSelectedOption(choice.id)}
              disabled={false}
            />
          ))}
        </div>
      </div>
    </ActivityGameCard>
    
  );
}