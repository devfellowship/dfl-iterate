import { useContext } from 'react';
import { AuthContext } from '@/providers/auth-context';

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession precisa estar dentro de AuthProvider.');
  }
  return value;
}
