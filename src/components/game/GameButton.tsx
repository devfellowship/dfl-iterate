import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@devfellowship/components';

interface GameButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-success text-success-foreground border-b-4 border-success-dark hover:brightness-110',
  secondary: 'bg-primary text-primary-foreground border-b-4 border-primary-dark hover:brightness-110',
  tertiary: 'bg-transparent text-muted-foreground border-2 border-border hover:bg-muted hover:text-foreground',
  danger: 'bg-destructive text-destructive-foreground border-b-4 border-destructive-dark hover:brightness-110',
};

export function GameButton({ 
  className, 
  variant = 'primary', 
  icon, 
  children, 
  disabled,
  onClick,
  type = 'button'
}: GameButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "px-6 py-3 min-w-[140px]",
        "font-display font-bold text-base uppercase tracking-wide",
        "rounded-2xl",
        "transition-all duration-100",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variantStyles[variant],
        className
      )}
      whileHover={!disabled ? { y: -2 } : undefined}
      whileTap={!disabled ? { y: 2 } : undefined}
      disabled={disabled}
    >
      {icon}
      {children}
    </motion.button>
  );
}
