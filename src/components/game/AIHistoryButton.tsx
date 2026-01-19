import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface AIHistoryButtonProps {
  messageCount: number;
  onClick: () => void;
}

export function AIHistoryButton({ messageCount, onClick }: AIHistoryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border hover:bg-muted transition-colors shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Bot className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-bold text-foreground">{messageCount}</span>
    </motion.button>
  );
}
