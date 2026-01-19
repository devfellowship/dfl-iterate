import { useMemo } from 'react';
import { Decision } from '@/types';

export interface PreviewState {
  headerStyle: 'basic' | 'styled';
  cardsStyle: 'basic' | 'enhanced';
  stateManagement: 'none' | 'context' | 'zustand' | 'localstorage';
  checkoutWorking: boolean;
  cartCount: number;
  updateBadge?: string;
}

const initialState: PreviewState = {
  headerStyle: 'basic',
  cardsStyle: 'basic',
  stateManagement: 'none',
  checkoutWorking: false,
  cartCount: 0,
};

export function usePreviewState(
  completedActivities: number[],
  decisions: Decision[]
): PreviewState {
  return useMemo(() => {
    let state = { ...initialState };
    
    // After Activity 1: Header styled
    if (completedActivities.includes(0)) {
      state.headerStyle = 'styled';
      state.updateBadge = '✨ Header atualizado';
    }
    
    // After Activity 2: Cards enhanced
    if (completedActivities.includes(1)) {
      state.cardsStyle = 'enhanced';
      state.updateBadge = '⚡ Performance otimizada';
    }
    
    // After Activity 3: State management active
    if (completedActivities.includes(2)) {
      // Find the decision for state management
      const stateDecision = decisions.find(d => 
        d.choice === 'opt-context' || 
        d.choice === 'opt-zustand' || 
        d.choice === 'opt-localstorage'
      );
      
      if (stateDecision?.choice === 'opt-context') {
        state.stateManagement = 'context';
      } else if (stateDecision?.choice === 'opt-zustand') {
        state.stateManagement = 'zustand';
      } else if (stateDecision?.choice === 'opt-localstorage') {
        state.stateManagement = 'localstorage';
      } else {
        state.stateManagement = 'zustand'; // Default
      }
      
      state.cartCount = 2;
      state.updateBadge = '🗄️ State management ativo';
    }
    
    // After Activity 4: Checkout working
    if (completedActivities.includes(3)) {
      state.checkoutWorking = true;
      state.cartCount = 3;
      state.updateBadge = '✅ Checkout funcionando';
    }
    
    return state;
  }, [completedActivities, decisions]);
}
