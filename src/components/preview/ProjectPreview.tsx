import { motion } from 'framer-motion';
import { ProjectStatus } from '@/enums';
import { RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectPreviewProps {
  status: ProjectStatus;
  errorMessage?: string;
}

export function ProjectPreview({ status, errorMessage }: ProjectPreviewProps) {
  const isBroken = status === ProjectStatus.BROKEN;

  return (
    <div className="h-full w-full flex flex-col bg-card border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-warning/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">BoxShop Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview Content - Full width */}
      <div className="flex-1 bg-white relative overflow-auto">
        {isBroken ? (
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-red-700 mb-2">Build Error</h3>
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 max-w-md">
              <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap">
                {errorMessage || 'TypeError: Cannot read property \'map\' of undefined'}
              </pre>
            </div>
          </motion.div>
        ) : (
          <MockPreview />
        )}
      </div>
    </div>
  );
}

function MockPreview() {
  return (
    <div className="min-h-full">
      {/* Mock Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥊</span>
            <span className="font-bold text-gray-900 text-lg">BoxShop</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Home</span>
            <span className="hover:text-gray-900 cursor-pointer">Produtos</span>
            <span className="hover:text-gray-900 cursor-pointer">Carrinho (3)</span>
          </div>
        </div>
      </div>

      {/* Mock Product Grid */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Equipamentos de Boxe</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Luva de Boxe Pro', price: 'R$ 299,90', emoji: '🥊' },
            { name: 'Saco de Pancada', price: 'R$ 459,90', emoji: '🎯' },
            { name: 'Bandagem Elástica', price: 'R$ 29,90', emoji: '🩹' },
            { name: 'Protetor Bucal', price: 'R$ 49,90', emoji: '😬' },
          ].map((product, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl mb-3">{product.emoji}</div>
              <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
              <p className="text-gray-900 font-bold mt-1">{product.price}</p>
              <button className="mt-3 w-full bg-gray-900 text-white text-xs py-2 rounded hover:bg-gray-800 transition-colors">
                Adicionar
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
