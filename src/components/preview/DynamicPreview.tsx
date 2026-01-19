import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ExternalLink, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PreviewState } from '@/hooks/usePreviewState';
import { ProjectStatus } from '@/enums';

interface DynamicPreviewProps {
  status: ProjectStatus;
  previewState: PreviewState;
  errorMessage?: string;
  lastCompletedActivity?: number;
}

export function DynamicPreview({ 
  status, 
  previewState, 
  errorMessage,
  lastCompletedActivity 
}: DynamicPreviewProps) {
  const isBroken = status === ProjectStatus.BROKEN;
  const [showBadge, setShowBadge] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<string | undefined>();

  // Show update badge when activity completes
  useEffect(() => {
    if (previewState.updateBadge && lastCompletedActivity !== undefined) {
      setCurrentBadge(previewState.updateBadge);
      setShowBadge(true);
      const timer = setTimeout(() => setShowBadge(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [lastCompletedActivity, previewState.updateBadge]);

  return (
    <div className="h-full w-full flex flex-col bg-card border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className={`w-3 h-3 rounded-full ${isBroken ? 'bg-destructive' : 'bg-success'}`} />
            <div className="w-3 h-3 rounded-full bg-warning/60" />
            <div className="w-3 h-3 rounded-full bg-muted" />
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

      {/* Preview Content */}
      <div className="flex-1 bg-white relative overflow-auto">
        {/* Update Badge */}
        <AnimatePresence>
          {showBadge && currentBadge && (
            <motion.div
              className="absolute top-4 left-1/2 z-20 px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg"
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -10, x: '-50%' }}
            >
              {currentBadge}
            </motion.div>
          )}
        </AnimatePresence>

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
          <MockPreview previewState={previewState} lastCompletedActivity={lastCompletedActivity} />
        )}
      </div>
    </div>
  );
}

interface MockPreviewProps {
  previewState: PreviewState;
  lastCompletedActivity?: number;
}

function MockPreview({ previewState, lastCompletedActivity }: MockPreviewProps) {
  const { headerStyle, cardsStyle, stateManagement, checkoutWorking, cartCount } = previewState;
  
  const isHeaderHighlighted = lastCompletedActivity === 0;
  const isCardsHighlighted = lastCompletedActivity === 1;
  const isCartHighlighted = lastCompletedActivity === 2;
  const isCheckoutHighlighted = lastCompletedActivity === 3;

  const products = [
    { name: 'Luva de Boxe Pro', price: 'R$ 299,90', emoji: '🥊' },
    { name: 'Saco de Pancada', price: 'R$ 459,90', emoji: '🎯' },
    { name: 'Bandagem Elástica', price: 'R$ 29,90', emoji: '🩹' },
    { name: 'Protetor Bucal', price: 'R$ 49,90', emoji: '😬' },
  ];

  const stateLabel = stateManagement === 'context' 
    ? 'Context' 
    : stateManagement === 'zustand' 
      ? 'Zustand' 
      : stateManagement === 'localstorage' 
        ? 'LocalStorage' 
        : null;

  return (
    <div className="min-h-full">
      {/* Header */}
      <motion.div 
        className={`border-b transition-all duration-500 ${
          headerStyle === 'styled' 
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        } ${isHeaderHighlighted ? 'animate-update-glow' : ''}`}
        animate={isHeaderHighlighted ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className={`px-6 py-4 ${headerStyle === 'styled' ? 'py-5' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥊</span>
              <span className={`font-bold text-lg ${
                headerStyle === 'styled' 
                  ? 'text-white tracking-wide' 
                  : 'text-gray-900'
              }`}>
                {headerStyle === 'styled' ? 'BOXSHOP' : 'BoxShop'}
              </span>
            </div>
            <div className="flex items-center gap-6">
              {headerStyle === 'styled' ? (
                <>
                  <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-300">
                    <span className="hover:text-white cursor-pointer transition-colors">Home</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Produtos</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Sobre</span>
                  </nav>
                  <motion.div 
                    className={`relative ${isCartHighlighted ? 'animate-update-glow' : ''}`}
                    animate={isCartHighlighted ? { scale: [1, 1.1, 1] } : {}}
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                    {cartCount > 0 && (
                      <motion.span 
                        className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-xs font-bold rounded-full flex items-center justify-center text-black"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.div>
                </>
              ) : (
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="hover:text-gray-900 cursor-pointer">Home</span>
                  <span className="hover:text-gray-900 cursor-pointer">Produtos</span>
                  <span className="hover:text-gray-900 cursor-pointer">Carrinho (3)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* State Management Badge */}
      <AnimatePresence>
        {stateLabel && (
          <motion.div 
            className="px-6 py-2 bg-gray-50 border-b border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <span className="text-xs font-mono text-gray-500">
              State: <span className="text-primary font-semibold">{stateLabel}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Equipamentos de Boxe</h2>
        <div className={`grid gap-4 ${isCardsHighlighted ? 'animate-update-glow rounded-xl' : ''}`} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {products.map((product, i) => (
            <motion.div
              key={i}
              className={`rounded-lg p-4 border transition-all duration-300 ${
                cardsStyle === 'enhanced'
                  ? 'bg-white border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1'
                  : 'bg-gray-50 border-gray-100'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={cardsStyle === 'enhanced' ? { scale: 1.02 } : {}}
            >
              <div className="text-4xl mb-3">{product.emoji}</div>
              <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
              <p className="text-gray-900 font-bold mt-1">{product.price}</p>
              <button className={`mt-3 w-full text-xs py-2 rounded transition-all duration-200 ${
                cardsStyle === 'enhanced'
                  ? 'bg-primary text-black font-bold hover:bg-primary-dark'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                {cardsStyle === 'enhanced' ? '🛒 Adicionar' : 'Adicionar'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Checkout Section */}
      <AnimatePresence>
        {checkoutWorking && (
          <motion.div 
            className={`mx-6 mb-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white ${
              isCheckoutHighlighted ? 'animate-update-glow' : ''
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Checkout</h3>
              <span className="text-green-400 text-sm font-semibold">✓ Funcionando</span>
            </div>
            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <div className="flex justify-between">
                <span>Luva de Boxe Pro</span>
                <span>R$ 299,90</span>
              </div>
              <div className="flex justify-between">
                <span>Saco de Pancada</span>
                <span>R$ 459,90</span>
              </div>
              <div className="flex justify-between">
                <span>Protetor Bucal</span>
                <span>R$ 49,90</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-xl text-primary">R$ 809,70</span>
            </div>
            <button className="mt-4 w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors">
              Finalizar Compra
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
