import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIResponseProps {
  text: string;
  isStreaming: boolean;
}

export function AIResponse({ text, isStreaming }: AIResponseProps) {
  if (!text && !isStreaming) return null;

  // Parse markdown-like syntax for code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={i} className="my-3 rounded-lg overflow-hidden bg-[#1e1e1e] border border-border">
            {language && (
              <div className="px-3 py-1.5 bg-muted/50 border-b border-border text-xs text-muted-foreground">
                {language}
              </div>
            )}
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-foreground">{code}</code>
            </pre>
          </div>
        );
      }
      
      // Handle bold text
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {boldParts.map((p, j) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={j} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
            }
            // Handle inline code
            const codeParts = p.split(/(`[^`]+`)/g);
            return codeParts.map((cp, k) => {
              if (cp.startsWith('`') && cp.endsWith('`')) {
                return (
                  <code key={k} className="px-1.5 py-0.5 rounded bg-muted text-primary text-sm font-mono">
                    {cp.slice(1, -1)}
                  </code>
                );
              }
              return cp;
            });
          })}
        </span>
      );
    });
  };

  return (
    <motion.div
      className="p-4 rounded-xl bg-muted/30 border border-border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <span className="text-lg">🤖</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-primary mb-2">AI Assistant</div>
          <div className={cn(
            "text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed",
            isStreaming && "streaming-cursor"
          )}>
            {renderContent(text)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
