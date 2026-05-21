import { ReactNode } from 'react';

interface PairItemProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  badge?: ReactNode;
  setRef?: (el: HTMLButtonElement | null) => void;
}

export function PairItem({ label, onClick, disabled, className, badge, setRef }: PairItemProps) {
  return (
    <button ref={setRef} type="button" onClick={onClick} disabled={disabled} className={className}>
      {label}
      {badge}
    </button>
  );
}