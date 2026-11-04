import { useEffect } from 'react';
import { useGetProfile } from '@/hooks';

export function ThemeSync() {
  const { data } = useGetProfile();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', data?.theme === 'dark');
  }, [data?.theme]);

  return null;
}
