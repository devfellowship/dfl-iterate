import { ReactNode } from 'react';
import { PairItem } from '@/components/atoms/PairItem/PairItem';

interface PairListProps<TItem> {
  items: TItem[];
  getKey: (item: TItem) => string;
  getLabel: (item: TItem) => string;
  onItemClick: (item: TItem) => void;
  isItemDisabled?: (item: TItem) => boolean;
  getItemClassName: (item: TItem) => string;
  getItemBadge?: (item: TItem) => ReactNode;
  setItemRef?: (item: TItem, el: HTMLButtonElement | null) => void;
  className?: string;
}

export function PairList<TItem>({
  items,
  getKey,
  getLabel,
  onItemClick,
  isItemDisabled,
  getItemClassName,
  getItemBadge,
  setItemRef,
  className,
}: PairListProps<TItem>) {
  return (
    <div className={className}>
      {items.map((item) => (
        <PairItem
          key={getKey(item)}
          label={getLabel(item)}
          onClick={() => onItemClick(item)}
          disabled={isItemDisabled?.(item)}
          className={getItemClassName(item)}
          badge={getItemBadge?.(item)}
          setRef={setItemRef ? (el) => setItemRef(item, el) : undefined}
        />
      ))}
    </div>
  );
}