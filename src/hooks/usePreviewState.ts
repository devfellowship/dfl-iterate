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

// Preview state based on current activity index (time travel!)
export function usePreviewState(
  currentActivityIndex: number,
  completedActivities: number[],
  decisions: Decision[]
): PreviewState {
  return useMemo(() => {
    let state = { ...initialState };
    
    // Show state UP TO the current activity
    // If viewing activity 0, show initial state
    // If viewing activity 1, show state after activity 0 completed (if it was)
    
    // After Activity 1 completed AND viewing activity 1+: Header styled
    if (completedActivities.includes(0) && currentActivityIndex >= 1) {
      state.headerStyle = 'styled';
      if (currentActivityIndex === 1) {
        state.updateBadge = '✨ Header atualizado';
      }
    }
    
    // After Activity 2 completed AND viewing activity 2+: Cards enhanced
    if (completedActivities.includes(1) && currentActivityIndex >= 2) {
      state.cardsStyle = 'enhanced';
      if (currentActivityIndex === 2) {
        state.updateBadge = '⚡ Performance otimizada';
      }
    }
    
    // After Activity 3 completed AND viewing activity 3+: State management active
    if (completedActivities.includes(2) && currentActivityIndex >= 3) {
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
        state.stateManagement = 'zustand';
      }
      
      state.cartCount = 2;
      if (currentActivityIndex === 3) {
        state.updateBadge = '🗄️ State management ativo';
      }
    }
    
    // After Activity 4 completed AND viewing activity 4+: Checkout working
    if (completedActivities.includes(3) && currentActivityIndex >= 4) {
      state.checkoutWorking = true;
      state.cartCount = 3;
      if (currentActivityIndex === 4) {
        state.updateBadge = '✅ Checkout funcionando';
      }
    }
    
    return state;
  }, [currentActivityIndex, completedActivities, decisions]);
}
