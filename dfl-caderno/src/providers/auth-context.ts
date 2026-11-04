import { createContext } from 'react';
import type { Session } from '@supabase/supabase-js';

export type AuthState = {
  session: Session | null;
  isReady: boolean;
};

export const AuthContext = createContext<AuthState | null>(null);
