import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import { AIMessage } from '@/hooks/useAIHistory';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AIHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AIMessage[];
}

export function AIHistoryDrawer({ isOpen, onClose, messages }: AIHistoryDrawerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Parse markdown-like syntax
  const renderMessage = (content: string) => {
    const lines = content.split('\n');
    
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
        }
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, k) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return (
              <code key={k} className="px-1 py-0.5 rounded bg-muted text-primary text-xs font-mono">
                {cp.slice(1, -1)}
              </code>
            );
          }
          return cp;
        });
      });
      
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex gap-2 ml-2">
            <span className="text-muted-foreground">•</span>
            <span>{rendered}</span>
          </div>
        );
      }
      
      return <div key={i}>{rendered}</div>;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-[400px] max-w-[90vw] h-full bg-card border-l border-border z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">🤖</span>
                <h2 className="font-display font-bold text-lg text-foreground">AI History</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {messages.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <span className="text-3xl block mb-2">🤖</span>
                  <p className="text-sm">Nenhuma mensagem ainda.</p>
                  <p className="text-xs mt-1">Complete atividades para ver o feedback do AI.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isExpanded = expandedId === msg.id;
                  
                  return (
                    <motion.div
                      key={msg.id}
                      className={`bg-background border rounded-xl overflow-hidden cursor-pointer transition-colors ${
                        msg.isSuccess 
                          ? 'border-l-4 border-l-success border-t-border border-r-border border-b-border hover:border-success/50' 
                          : 'border-l-4 border-l-destructive border-t-border border-r-border border-b-border hover:border-destructive/50'
                      }`}
                      onClick={() => toggleExpand(msg.id)}
                      layout
                    >
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {msg.isSuccess ? (
                              <CheckCircle2 size={16} className="text-success" />
                            ) : (
                              <XCircle size={16} className="text-destructive" />
                            )}
                            <span className="font-semibold text-sm text-foreground">
                              Activity {msg.activityOrder}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(msg.timestamp, { addSuffix: true, locale: ptBR })}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-muted-foreground" />
                            ) : (
                              <ChevronDown size={16} className="text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Message Preview/Full */}
                        <div className={`text-sm text-muted-foreground leading-relaxed ${
                          !isExpanded ? 'line-clamp-3' : ''
                        }`}>
                          {isExpanded ? (
                            <div className="space-y-1">{renderMessage(msg.message)}</div>
                          ) : (
                            msg.message.split('\n').slice(0, 2).join(' ').slice(0, 100) + '...'
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
