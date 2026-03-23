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

  useEffect(() => {
    if (containerRef.current) {
      const swapy = createSwapy(containerRef.current);
      swapy.onSwap((event) => {
        console.log('Nova ordem detectada:', event);
      });

      return () => swapy.destroy();
    }
  }, );

  // Pegamos os blocos da atividade (ou um array vazio se não houver)
  const blocks = activity.codeBlocks || [];

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
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Coluna de Origem */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <GripVertical className="w-3 h-3" />
            Blocos Disponíveis
          </h3>
          
          <div className="space-y-2">
            {blocks.map((block) => (
              <div 
                key={`slot-${block.id}`} 
                data-swapy-slot={block.id} 
                className="min-h-[56px] bg-muted/50 rounded-lg border-2 border-transparent"
              >
                <div 
                  data-swapy-item={block.id} 
                  className="group flex items-center gap-3 p-3 bg-background border border-border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <code className="font-mono text-sm text-foreground bg-muted/30 px-2 py-1 rounded">
                    {block.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Destino */}
        <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-dashed border-border">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <ListOrdered className="w-3 h-3" />
            Sua Solução
          </h3>

          <div className="space-y-2">
            {blocks.map((_, index) => (
              <div 
                key={`target-${index}`} 
                data-swapy-slot={`target-${index}`} 
                className="min-h-[56px] bg-background/50 border-2 border-dashed border-border rounded-lg flex items-center justify-center"
              >
                <span className="text-muted-foreground/30 font-mono text-xs">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}