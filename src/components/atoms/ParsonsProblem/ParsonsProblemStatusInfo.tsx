interface ParsonsProblemStatusInfoProps {
  correctOrder?: string[];
  solutionOrder: string[];
  blockCount: number;
}

export function ParsonsProblemStatusInfo({ correctOrder, solutionOrder, blockCount }: ParsonsProblemStatusInfoProps) {
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      {correctOrder && correctOrder.length > 0 && (
        <p>
          Ordem correta: <span className="font-mono text-foreground">{correctOrder.join(' → ')}</span>
        </p>
      )}
      <p>
        {solutionOrder.length > 0
          ? `Ordem atual: ${solutionOrder.join(' → ')}`
          : 'Arraste todos os blocos para a área à direita e depois envie.'}
      </p>
      <p className="text-primary">Blocos carregados: {blockCount}</p>
      {blockCount === 0 && (
        <p className="text-red-500">
          Nenhum bloco encontrado. Verifique se a atividade possui `codeBlocks` no teste.
        </p>
      )}
    </div>
  );
}
