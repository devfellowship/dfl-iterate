import React, { useEffect, useRef } from 'react';
import { createSwapy } from 'swapy';
import { Activity } from '@/types';
import { GripVertical, ListOrdered, Puzzle } from 'lucide-react';

interface ParsonsProblemProps {
  activity: Activity;
  onSubmit?: (orderedBlocks: string[]) => void;
}

export function ParsonsProblem({ activity, onSubmit }: ParsonsProblemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [solutionOrder, setSolutionOrder] = React.useState<string[]>([]);
  const [targetItems, setTargetItems] = React.useState<Activity['codeBlocks']>([]);
  const blocks = React.useMemo(() => activity.codeBlocks || [], [activity.codeBlocks]);

  useEffect(() => {
    if (blocks.length === 0) {
      setTargetItems([]);
      setSolutionOrder([]);
      return;
    }

    const shuffled = [...blocks].sort(() => Math.random() - 0.5);
    setTargetItems(shuffled);
    setSolutionOrder(shuffled.map((block) => block.id));
  }, [activity, blocks]);

  useEffect(() => {
    if (!containerRef.current) return;

    const swapy = createSwapy(containerRef.current, { animation: 'spring' });
    const updateSolutionOrder = () => {
      if (!containerRef.current) return;

      const slotElements = Array.from(
        containerRef.current.querySelectorAll<HTMLDivElement>("[data-swapy-slot]")
      );

      const order = slotElements
        .map((slot) => {
          const item = slot.querySelector<HTMLDivElement>('[data-swapy-item]');
          return item?.dataset.swapyItem || null;
        })
        .filter((id): id is string => Boolean(id));

      setSolutionOrder(order);
    };

    swapy.onSwap(() => {
      updateSolutionOrder();
    });

    // initial order
    updateSolutionOrder();

    return () => swapy.destroy();
  }, [targetItems]);

  console.log('[ParsonsProblem] activity:', activity);
  console.log('[ParsonsProblem] blocks:', blocks);

  // Construir o código montado baseado na ordem atual
  const assembledCode = solutionOrder
    .map(blockId => blocks.find(b => b.id === blockId)?.code)
    .filter(Boolean)
    .join('\n');

  return (
    <div className="flex flex-col gap-6 p-6 bg-card rounded-xl shadow-sm border border-border">
      
      {/* 1. Cabeçalho Centralizado: Título e Instruções */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <Puzzle className="w-6 h-6 text-primary" />
          {activity.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {activity.instructions}
        </p>
      </div>

      <hr className="border-border" />

      {/* 2. Área do Jogo (Swapy Container) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna de Origem */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <GripVertical className="w-3 h-3" />
            Blocos Disponíveis
          </h3>
          <div className="space-y-2">
            {blocks.map((block) => (
              <div key={`source-${block.id}`} className="p-3 bg-background border border-border rounded-lg">
                <code className="font-mono text-sm text-foreground">{block.code}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Destino */}
        <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-dashed border-border" ref={containerRef}>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <ListOrdered className="w-3 h-3" />
            Sua Solução
          </h3>

          <div className="space-y-2">
            {targetItems.map((block, index) => (
              <div
                key={`target-${block.id}`}
                data-swapy-slot={`target-${index}`}
                className="min-h-[56px] bg-background/50 border-2 border-dashed border-border rounded-lg"
              >
                <div
                  data-swapy-item={block.id}
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground transition-colors" />
                  <code className="font-mono text-sm text-foreground">{block.code}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Código Montado */}
      {assembledCode && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Código Montado
          </h3>
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
              {assembledCode}
            </pre>
          </div>
        </div>
      )}

      {/* 4. Ações e Feedback */}
      <div className="mt-4 flex flex-col gap-2">
        {activity.correctOrder && activity.correctOrder.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Ordem correta: <span className="font-mono text-foreground">{activity.correctOrder.join(' → ')}</span>
          </p>
        )}

        <button
          type="button"
          onClick={() => onSubmit?.(solutionOrder)}
          disabled={solutionOrder.length !== blocks.length}
          className="self-start rounded-lg px-4 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:bg-muted/50"
        >
          Enviar solução
        </button>

        <p className="text-xs text-muted-foreground">
          {solutionOrder.length > 0
            ? `Ordem atual: ${solutionOrder.join(' → ')}`
            : 'Arraste todos os blocos para a área à direita e depois envie.'}
        </p>

        <p className="text-xs text-primary">
          Blocos carregados: {blocks.length}
        </p>

        {blocks.length === 0 && (
          <p className="text-xs text-red-500">
            Nenhum bloco encontrado. Verifique se a atividade possui `codeBlocks` no teste.
          </p>
        )}
      </div>
    </div>
  );
}