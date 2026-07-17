import { useT } from '@/i18n/LangContext';

interface StatusInfoProps {
  correctOrder?: string[];
  solutionOrder: string[];
  blockCount: number;
}

export function StatusInfo({ correctOrder, solutionOrder, blockCount }: StatusInfoProps) {
  const { t } = useT();
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      {correctOrder && correctOrder.length > 0 && (
        <p>
          {t('atoms.statusInfo.correctOrder')} <span className="font-mono text-foreground">{correctOrder.join(' → ')}</span>
        </p>
      )}
      <p>
        {solutionOrder.length > 0
          ? `${t('atoms.statusInfo.currentOrder')} ${solutionOrder.join(' → ')}`
          : t('atoms.statusInfo.dragAllBlocks')}
      </p>
      <p className="text-primary">{t('atoms.statusInfo.blocksLoaded')} {blockCount}</p>
      {blockCount === 0 && (
        <p className="text-red-500">
          {t('atoms.statusInfo.noBlocksFound')}
        </p>
      )}
    </div>
  );
}
