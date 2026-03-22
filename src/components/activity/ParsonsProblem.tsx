import React, { useEffect, useRef } from 'react';
import { createSwapy } from 'swapy';
import { Activity } from '@/types';

interface ParsonsProblemProps {
  activity: Activity;
  onSubmit?: (orderedBlocks: string[]) => void;
}

export const ParsonsProblem: React.FC<ParsonsProblemProps> = ({ activity, onSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 1. Inicializa o Swapy no container pai
      const swapy = createSwapy(containerRef.current);

      // 2. Opcional: Escuta quando algo muda de lugar
      swapy.onSwap((event) => {
        console.log('Nova ordem detectada:', event);
      });

      return () => swapy.destroy();
    }
  }, []);

  // Pegamos os blocos da atividade (ou um array vazio se não houver)
  const blocks = activity.codeBlocks || [];

  return (
    <div ref={containerRef} className="flex gap-8 p-4 bg-slate-50 rounded-lg">
      
      {/* Coluna de Origem */}
      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase">Blocos</h3>
        {blocks.map((block) => (
          // O data-swapy-slot define onde um item pode cair
          <div key={`slot-${block.id}`} data-swapy-slot={block.id} className="h-12 bg-slate-200 rounded">
            
            {/* O data-swapy-item é o que realmente se move */}
            <div 
              data-swapy-item={block.id} 
              className="p-3 bg-white border border-slate-300 rounded shadow-sm cursor-grab font-mono text-sm"
            >
              {block.code}
            </div>

          </div>
        ))}
      </div>

      {/* Coluna de Destino (Vazia inicialmente) */}
      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase">Solução</h3>
        {blocks.map((_, index) => (
          <div 
            key={`target-${index}`} 
            data-swapy-slot={`target-${index}`} 
            className="h-12 bg-slate-300/50 border-2 border-dashed border-slate-400 rounded"
          >
            <div className='bg-pink-600'>Sou legal</div>
          </div>
        ))}
      </div>

    </div>
  );
};